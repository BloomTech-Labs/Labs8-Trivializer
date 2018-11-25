import React, { Component } from "react";
import Questions from "./Questions";

class RoundAnswers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: this.props.questions
    };
  }

  render() {
    // The following are for React Drag N Drop functionality
    const questions = this.props.questions;

    return (
      <div>
        {/* Map over questions and display questions with highlighted correct answer*/}
        {questions.map((question, index) => {
          return (
            <Questions key={question.id} index={index} question={question} />
          );
        })}
      </div>
    );
  }
}

export default RoundAnswers;
