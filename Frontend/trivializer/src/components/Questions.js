import React, { Component } from "react";
import axios from "axios";

class Questions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameId: this.props.gameID,
      roundname: this.props.roundname,
      numberOfQuestions: this.props.numberOfQuestions,
      category: this.props.category,
      difficulty: this.props.difficulty,
      type: this.props.type,
      questions: "",
      baseURL: "https://opentdb.com/api.php?"
    };
  }

  componentDidMount = () => {
    //   Prepare arguments to questions API
    let amount = `amount=${this.state.numberOfQuestions || 1}`;
    let category = `category=${this.state.category || "none"}`;
    let difficulty = `difficulty=${this.state.difficulty || "none"}`;
    let type = `type=${this.state.type || "none"}`;

    //   Call axios with input parameters
  };
  render() {
    return <div>Questions</div>;
  }
}

export default Questions;
