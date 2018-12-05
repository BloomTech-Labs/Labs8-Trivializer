import React, { Component } from "react";
import Questions from "./Questions";

const createDOMPurify = require("dompurify"); // Prevents XSS attacks from incoming HTML

// Sanitizes incoming HTML from questions API and allows for HTML entities while protecting against XSS attacks
const DOMPurify = createDOMPurify(window);

class RoundUserSheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: []
    };
  }

  componentDidMount = () => {
    this.setState({ questions: this.props.questions });
  };

  render() {
    const questions = this.props.questions;

    return (
      <div className="hiddenAnswers">
        <div className="hiddenAnswers-info">
          <div>{this.props.gameName}</div>
          <div>{this.props.roundName}</div>
          <div>
            <img
              className="logo-rounds"
              src={require("../img/trivializer_cropped.png")}
              alt="trivializer logo"
            />
          </div>
        </div>

        <div className="instructions-round">
          ***Please Circle the Correct Answer***
        </div>
        {this.state.questions.map((question, index) => {
          return (
            <div key={index} className="question">
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    `${index + 1}) ` + DOMPurify.sanitize(question.question) // See line 5 for DOMPurify description
                }}
              />
              <div>
                <ul className="questions">
                  {question.answers.map((answer, index) => {
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
          );
        })}
      </div>
    );
  }
}

export default RoundUserSheet;
