import React, { Component } from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import Questions from "./Questions";
import axios from "axios";
import "./Questions.css";

class Round extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameId: this.props.gameID || 1,
      roundname: this.props.roundname || "Round 1",
      numberOfQuestions: this.props.numberOfQuestions || 5,
      category: this.props.category || "",
      difficulty: this.props.difficulty || "easy",
      type: this.props.type || "multiple",
      questions: [],
      baseURL: "https://opentdb.com/api.php?"
    };
  }

  componentDidMount = () => {
    console.log("this.state: ", this.state);
    //   Prepare arguments to questions API

    // Check is each is undefined, if it is, don't include it in the URL
    let amount = `&amount=${this.state.numberOfQuestions || 1}`;
    let category = `${
      this.state.category ? `&category=${this.state.category}` : ""
    }`;
    let difficulty = `${
      this.state.difficulty ? `&difficulty=${this.state.difficulty}` : ""
    }`;
    let type = `${this.state.category ? `&type=${this.state.type}` : ""}`;

    let concatenatedURL = `${
      this.state.baseURL
    }${amount}${category}${difficulty}${type}`;

    console.log("concatenatedURL: ", concatenatedURL);
    //   Call axios with input parameters

    axios.get(concatenatedURL).then(response => {
      this.setState({ questions: response.data.results });
    });
  };

  render() {
    console.log("this.state.questions: ", this.state.questions);
    return (
      <div className="game-page">
        <div className="top-content">
          <div className="top-leftside">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Games
                </li>
              </ol>
            </nav>
          </div>
          <Link className="top-rightside" to="/">
            Sign Out
          </Link>
        </div>

        <div className="main-content">
          <Navbar />
          <div>Questions</div>
          <div>
            {this.state.questions.map((question, index) => {
              return <Questions key={index} question={question} />;
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default Round;
