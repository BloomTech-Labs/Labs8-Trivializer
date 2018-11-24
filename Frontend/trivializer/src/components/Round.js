import React, { Component } from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import Questions from "./Questions";
import axios from "axios";
import "./Questions.css";
import update from "react-addons-update";
import RoundAnswers from "./RoundAnswers";
import ReactToPrint from "react-to-print";

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
      baseURL: "https://opentdb.com/api.php?"
    };
  }

  componentDidMount = () => {
    // If questions are passed in, just collect the answers, don't make the API call
    if (this.state.questions.length > 0) {
      // questions will now have unique Id's and complete answers array
      let questions = this.addIds(this.state.questions);

      this.setState({ questions: questions });
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
      // questions will now have unique Id's and complete answers array
      let questions = this.addIds(response.data.results);

      this.setState({ questions: questions });
    });
  };

  // This functions both adds id's to the incoming
  // questions (necessary for drag and drop) and complete answers
  addIds = questionsIn => {
    let questions = questionsIn.map((question, i) => {
      question.id = i;
      question.answers = this.assembleAnswers(
        question.correct_answer,
        question.incorrect_answers
      );
      return question;
    });

    return questions;
  };

  // Assembles all answers into one array
  assembleAnswers = (correct_answer, incorrect_answers) => {
    // Get a random number, this will be where we insert
    // the correct answer into the incorrect answers
    let index = Math.floor(Math.random() * (incorrect_answers.length + 1));
    let answers = incorrect_answers.slice();
    answers.splice(index, 0, correct_answer);

    return answers;
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

  print = () => {};

  render() {
    // Get questions from State
    const { questions } = this.state;

    return (
      //********************  Side bar Navigation  ***************/
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

        {/* ********************  Main Content  *************** */}
        <div className="main-content">
          <Navbar />
          <div className="main-content-round">
            <div className="top-content-round">
              <div className="col-1-round">
                <div className="title-round">{`${this.state.gamename} - ${
                  this.state.roundname
                }`}</div>

                <div className="info-round">
                  {`Difficulty: ${this.state.difficulty ||
                    "All"} \xa0\xa0\xa0\xa0\xa0 Questions: ${
                    this.state.questions.length
                  }`}
                </div>
              </div>
              <div className="col-2-round">
                <button
                  type="button"
                  className="btn btn-primary round"
                  data-toggle="modal"
                  data-target="#answerSheet"
                >
                  Print Answer Sheets
                </button>
                <button
                  type="button"
                  className="btn btn-primary round"
                  data-toggle="modal"
                  data-target="#answerKey"
                >
                  Print Answer Key
                </button>
              </div>
            </div>

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
            {/* ********************  Modals  *************** */}
            <div
              className="modal fade"
              id="answerSheet"
              tabIndex="-1"
              role="dialog"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog" role="document">
                <div className="modal-content modal-background">
                  <div className="modal-header">
                    <h5 className="modal-title">Modal title</h5>
                    <button
                      type="button"
                      className="close"
                      data-dismiss="modal"
                      aria-label="Close"
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    {/* Add a reference to RoundAnswers so we know what to print */}
                    <RoundAnswers
                      questions={questions}
                      ref={el => (this.componentRef = el)}
                    />
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-dismiss="modal"
                    >
                      Close
                    </button>
                    {/* Wrap button in a ReactToPrint component, with button as it's trigger,
                     and the referenced RoundAnswers component above as its content */}
                    <ReactToPrint
                      trigger={() => (
                        <button
                          type="button"
                          onClick={this.print}
                          className="btn btn-primary"
                        >
                          Print Answer Sheet
                        </button>
                      )}
                      content={() => this.componentRef}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* ********************  React to Print Components  *************** */}
          </div>
        </div>
      </div>
    );
  }
}

export default Round;
