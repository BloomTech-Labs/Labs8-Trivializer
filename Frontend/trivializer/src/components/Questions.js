import React, { Component } from "react";
import "./Questions.css";
import { DragSource, DropTarget } from "react-dnd";
import { findDOMNode } from "react-dom";
import flow from "lodash/flow"; // Necessary for react DnD to attach more than one function ("Role") to this component, i.e. any question is both a DragSource AND a DropTarget

const createDOMPurify = require("dompurify"); // Prevents XSS attacks from incoming HTML

// Sanitizes incoming HTML from questions API and allows for HTML entities while protecting against XSS attacks
const DOMPurify = createDOMPurify(window);

class Questions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question: this.props.question.question,
      correct: this.props.question.correct_answer,
      incorrect: this.props.question.incorrect_answers,
      all: []
    };
  }

  componentDidMount = () => {
    let incorrect = this.state.incorrect;
    let correct = this.state.correct;
    // Get a random number, this will be where we insert the correct answer into the incorrect answers
    let index = Math.floor(Math.random() * (incorrect.length + 1));
    // Splice into index, delete 0 elements, insert the correct answer
    let all = incorrect;
    all.splice(index, 0, correct);

    this.setState({ all: all });
  };

  render() {
    const {
      question,
      isDragging,
      connectDragSource,
      connectDropTarget,
      index
    } = this.props;
    const opacity = isDragging ? 0 : 1;

    return connectDragSource(
      connectDropTarget(
        <div className="question" style={{ opacity: opacity }}>
          <div
            dangerouslySetInnerHTML={{
              __html: `${index + 1}) ` + DOMPurify.sanitize(question.question) // See line 5 for DOMPurify description
            }}
          />
          <div>
            <ul className="questions">
              {/* We use incorrect answers because splice in componentDidMount changed the original value */}
              {question.incorrect_answers.map((answer, index) => {
                return (
                  <li
                    key={index}
                    className="answer"
                    dangerouslySetInnerHTML={{
                      // 0x41 is ASCII for 'A'
                      __html:
                        `${String.fromCharCode(0x41 + index)}) ` +
                        DOMPurify.sanitize(answer) // Purify incoming HTML while still displaying HTML entities
                    }}
                  />
                );
              })}
            </ul>
          </div>
        </div>
      )
    );
  }
}

// These functions below work with React DnD to determine the behavior of the dropped questions

const questionSource = {
  beginDrag(props) {
    return {
      question: props.question,
      index: props.index
    };
  }
};

const questionTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    props.moveQuestion(dragIndex, hoverIndex);

    monitor.getItem().index = hoverIndex;
  }
};

export default flow(
  DropTarget("QUESTION", questionTarget, connect => ({
    connectDropTarget: connect.dropTarget()
  })),
  DragSource("QUESTION", questionSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }))
)(Questions);
