import React, { Component } from "react";
import "./Questions.css";

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
    console.log("this.state.all: ", this.state.all);
    return (
      <div className="question">
        <div>{this.state.question}</div>
        <div>
          <ul className="questions">
            {this.state.all.map(answer => {
              return <li className="answer">{answer}</li>;
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default Questions;
