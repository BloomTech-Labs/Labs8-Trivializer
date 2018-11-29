import React, { Component } from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import Questions from "./Questions";
import axios from "axios";
import "./Questions.css";
import update from "react-addons-update";
import ReactToPrint from "react-to-print";
import { connect } from "react-redux";

const createDOMPurify = require("dompurify"); // Prevents XSS attacks from incoming HTML

// Sanitizes incoming HTML from questions API and allows for HTML entities while protecting against XSS attacks
const DOMPurify = createDOMPurify(window);

/**
 * Round Component
 * - renders selected round with an EditRoundView and Questions Component
 */
class Round extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameName: this.props.gameName,
      gameId: this.props.gameId,
      roundName: this.props.roundName,
      numberOfQuestions: this.props.numberOfQuestions,
      category: this.props.category,
      difficulty: this.props.difficulty,
      type: this.props.type,
      questions: [],
      questionsURL: "https://opentdb.com/api.php?",
      usersAPI: "http://localhost:3300/users",
      replace: [],
      noResults: false
    };
  }

  componentDidMount = () => {
    console.log("this.state componentDidMount: ", this.state);
    // If questions are passed in, just collect the answers, don't make the API call
    if (this.state.questions.length > 0) {
      // questions will now have unique Id's and complete answers array
      let questions = this.addIds(this.state.questions);

      this.setState({ questions: questions, noResults: false });
      return;
    }

    let concatenatedURL = this.buildApiCall();
    console.log("concatenatedURL: ", concatenatedURL);
    //   Call axios with input parameters
    axios.get(concatenatedURL).then(response => {
      if (response.data.response_code !== 0) {
        this.setState({ noResults: true });
      }
      console.log("response.data.results: ", response.data.results);
      // questions will now have unique Id's and complete answers array
      let questions = this.addIds(response.data.results);

      this.setState({ questions: questions });
    });
  };

  // Builds a call to the questions API based on which parameters in state are set
  buildApiCall = howManyQuestions => {
    let amount = `amount=${howManyQuestions ||
      this.state.numberOfQuestions ||
      1}`;

    let category = `${
      this.state.category ? `&category=${this.state.category}` : ""
    }`;

    let difficulty = `${
      this.state.difficulty ? `&difficulty=${this.state.difficulty}` : ""
    }`;

    let type = `${this.state.category ? `&type=${this.state.type}` : ""}`;

    let concatenatedURL = `${
      this.state.questionsURL
    }${amount}${category}${difficulty}${type}`;

    return concatenatedURL;
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

    // Uses React's update helper to increase speed and safely mutate state
    this.setState(
      update(this.state, {
        questions: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragQuestion]]
        }
      })
    );
  };

  // Gets a new question from Questions API based on settings in state
  // saves old question in state in case user hits "undo replace"
  replaceQuestion = (questionId, index) => {
    let apiURL = this.buildApiCall(1);

    axios.get(apiURL).then(response => {
      // questions will now have unique Id's and complete answers array
      let question = this.addIds(response.data.results)[0];
      // replace the default question Id with the removed question id
      question.id = questionId;

      let questions = this.state.questions.slice();
      let replace = this.state.replace.slice();

      // If sub array of questionId already exists, push the replaced question,
      // if not, create the sub-array
      replace[questionId]
        ? replace[questionId].push(questions[index])
        : (replace[questionId] = [questions[index]]);

      questions.splice(index, 1, question);

      this.setState({
        questions: questions,
        replace: replace
      });
    });
  };

  // Retrieves the old question saved in state in "replace"
  // replace is a 2d array, with each sub array corresponding to the id that question
  undoReplace = (questionId, index) => {
    // Only proceed if we have replaced that question
    if (
      !this.state.replace[questionId] ||
      this.state.replace[questionId].length < 1
    ) {
      return;
    }

    let questions = this.state.questions.slice();
    let replace = this.state.replace.slice();

    let question = replace[questionId].shift();
    questions.splice(index, 1, question);

    this.setState({
      questions: questions,
      replace: replace
    });
  };

  saveQuestions = () => {
    console.log(this.props.roundId);
    // Package all questions with rounds_id
    console.log("this.state.questions: ", this.state.questions);
    let questionsPackage = this.state.questions.map(question => {
      return {
        rounds_id: this.props.roundId,
        category: question.category,
        difficulty: question.difficulty,
        type: question.type,
        question: question.question,
        correct_answer: question.correct_answer,
        incorrect_answers: question.incorrect_answers.join("--")
      };
    });
    console.log("questionsPackage: ", questionsPackage);

    axios.post(`${this.state.usersAPI}/questions`, questionsPackage, {
      headers: {
        Authorization: `${sessionStorage.getItem("jwt")}`
      }
    })
    .then(response => {
      console.log(response)
    })
    .catch(err => {
      console.log("err.message: ", err.message);
    })
  };

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
                <div className="title-round">{`${this.state.gameName} - ${
                  this.state.roundName
                }`}</div>
                <div className="info-round">
                  {`Difficulty: ${this.state.difficulty ||
                    "All"} \xa0\xa0\xa0\xa0\xa0 Questions: ${
                    this.state.questions.length
                  }`}
                </div>
              </div>
              <div className="col-2-round">
                <ReactToPrint
                  trigger={() => (
                    <button type="button" className="btn btn-primary round">
                      Print Answer Sheet
                    </button>
                  )}
                  content={() => this.answerSheetRef}
                />
                <ReactToPrint
                  trigger={() => (
                    <button type="button" className="btn btn-primary round">
                      Print Answer Key
                    </button>
                  )}
                  content={() => this.answerKeyRef}
                />
                <div>
                  <button
                    onClick={this.saveQuestions}
                    type="button"
                    className="btn btn-primary save"
                  >
                    Save Round
                  </button>
                </div>
              </div>
            </div>
            {this.state.noResults ? (
              <div>No Results from Questions API!</div>
            ) : null}
            <div ref={el => (this.answerKeyRef = el)}>
              {questions.map((question, index) => {
                return (
                  <Questions
                    key={question.id}
                    index={index}
                    moveQuestion={this.moveQuestion}
                    replaceQuestion={() =>
                      this.replaceQuestion(question.id, index)
                    }
                    undoReplace={() => {
                      this.undoReplace(question.id, index);
                    }}
                    question={question}
                  />
                );
              })}
            </div>
            <div
              className="hiddenAnswers"
              ref={el => (this.answerSheetRef = el)}
            >
              <div className="hiddenAnswers-info">{this.state.gameName}</div>
              <div className="hiddenAnswers-info">{this.state.roundName}</div>
              <div className="hiddenAnswers-info">
                ***Please Circle the Correct Answer***
              </div>
              {this.state.questions.map((question, index) => {
                return (
                  <div key={index} className="question">
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          `${index + 1}) ` +
                          DOMPurify.sanitize(question.question) // See line 5 for DOMPurify description
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
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ gamesList }) => {
  return {
    roundId: gamesList.roundId,
    fetching_questions: gamesList.fetching_questions,
    fetched_questions: gamesList.fetched_questions,
    gameName: gamesList.gameName,
    gameId: gamesList.game_id,
    roundName: gamesList.roundName,
    numberOfQuestions: gamesList.numberOfQuestions,
    category: gamesList.category,
    difficulty: gamesList.difficulty,
    type: gamesList.type,
    questions: gamesList.questions
  };
};

export default connect(
  mapStateToProps,
  {}
)(Round);
