import React, { Component } from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import Questions from "./Questions";
import axios from "axios";
import "./Questions.css";
import update from "react-addons-update";

class Round extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gamename: this.props.gamename || "Wednesday Night Trivia",
      gameId: this.props.gameID || 1,
      roundname: this.props.roundname || "Round 1",
      numberOfQuestions: this.props.numberOfQuestions || 5,
      category: this.props.category || "",
      difficulty: this.props.difficulty || "easy",
      type: this.props.type || "multiple",
      questions: this.props.questions || [],
      answers: [],
      baseURL: "https://opentdb.com/api.php?"
    };
  }

  componentDidMount = () => {
    // If questions are passed in, just collect the answers, don't make the API call
    if (this.state.questions.length > 0) {
      // questionsAndAnswers[0] is the questions with new Id's, questionsAndAnswers[1] is the answers with corresponding ids
      let questionsAndAnswers = this.addIdsGetAnswers(this.state.questions);

      this.setState({
        questions: questionsAndAnswers[0],
        answers: questionsAndAnswers[1]
      });
      return;
    }

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

    //   Call axios with input parameters
    axios.get(concatenatedURL).then(response => {
      // questionsAndAnswers[0] is the questions with new Id's, questionsAndAnswers[1] is the answers with corresponding ids
      console.log(response.data);
      let questionsAndAnswers = this.addIdsGetAnswers(response.data.results);

      this.setState({
        questions: questionsAndAnswers[0],
        answers: questionsAndAnswers[1]
      });
    });
  };

  // This functions both adds id's to the incoming questions (necessary for drag and drop) and assembles the original answer sheet
  addIdsGetAnswers = questionsIn => {
    let answers = [];

    let questions = questionsIn.map((question, i) => {
      question.id = i;
      answers.push({ answer: question.correct_answer, id: i });
      return question;
    });

    return [questions, answers];
  };
  // Called from Questions.js, Reassigns the order of the questions array in state
  moveQuestion = (dragIndex, hoverIndex) => {
    const { questions } = this.state;

    const dragQuestion = questions[dragIndex];

    // Uses
    this.setState(
      update(this.state, {
        questions: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragQuestion]]
        }
      })
    );
  };

  render() {
    // The following are for React Drag N Drop functionality
    const { questions } = this.state;

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
          <div className="main-content-round">
            <div className="title-round">{`${this.state.gamename} - ${
              this.state.roundname
            }`}</div>

            <div className="info-round">{`Difficulty: ${this.state.difficulty ||
              "All"} \xa0\xa0\xa0\xa0\xa0 Questions: ${
              this.state.questions.length
            }`}</div>

            <div>
              {questions.map((question, index) => {
                return (
                  <Questions
                    key={question.id}
                    index={index}
                    moveQuestion={this.moveQuestion}
                    question={question}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Round;
