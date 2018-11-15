import React, { Component } from "react";
import axios from "axios";

class Round extends Component {
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

    let concatenatedURL = `${
      this.state.baseURL
    }&${amount}&${category}&${difficulty}&${type}`;
    //   Call axios with input parameters

    axios.get(concatenatedURL).then(res => {
      console.log(res);
    });
  };

  render() {
    return (
      <div>
        <div>Round</div>
      </div>
    );
  }
}

export default Round;
