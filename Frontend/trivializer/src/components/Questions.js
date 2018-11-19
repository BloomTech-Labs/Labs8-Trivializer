import React, { Component } from "react";
import "./Questions.css";
const createDOMPurify = require("dompurify");

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
    console.log("all: ", all);
    this.setState({ all: all });
  };

  render() {
    // Utilizes dangerouslySetInnerHTML. This is because we trust our API to not send malicious content
    // and
    return (
      <div className="question">
        <div
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(this.state.question) // See line 5 for DOMPurify description
          }}
        />
        <div>
          <ul className="questions">
            {this.state.all.map(answer => {
              return (
                <li
                  className="answer"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(answer) // See line 5 for DOMPurify description
                  }}
                />
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default Questions;
