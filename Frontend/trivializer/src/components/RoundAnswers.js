import React, { Component } from "react";

class RoundAnswers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: this.props.questions || [],
      answers: this.props.answers || []
    };
  }

  render() {
    return (
      <div>
        <div>Questions</div>
        {this.state.questions}
      </div>
    );
  }
}

export default RoundAnswers;
