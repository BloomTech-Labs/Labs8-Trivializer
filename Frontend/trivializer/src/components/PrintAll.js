import React, { Component } from "react";
import RoundAnswers from "./RoundAnswers";
import { connect } from "react-redux";
import "./PrintAll.css";
import {
  getAllRoundsReq,
  getAllQuestionsReq,
  resetAllRoundsAllQuestionsReq
} from "../actions";

class PrintAllAnswerKey extends Component {
  constructor(props) {
    super(props);
    this.state = {
      answers: true,
      rounds: [],
      questions: [],
      userSheets: this.props.userSheets
    };
  }

  componentDidMount = () => {
    this.props.getAllRoundsReq();
    this.props.getAllQuestionsReq();
    console.log("this.props PrintAll: ", this.props);
  };

  componentDidUpdate = (prevProps, prevState) => {
    // If our props for either rounds or questions have updated, set them
    // on state
    if (
      prevProps.all_rounds !== this.props.all_rounds ||
      prevProps.all_questions !== this.props.all_questions
    ) {
      this.setState({
        rounds: this.props.all_rounds,
        questions: this.props.all_questions
      });
    }
    // If The Redux store indicates that we have saved a new round
    // get rounds from the database
    if (this.props.saved_round) {
      this.props.getAllRoundsReq();
      this.props.resetAllRoundsAllQuestionsReq();
    }

    // If The Redux store indicates that we have saved new questions
    // get questions from the database
    if (this.props.saved_questions) {
      this.props.getAllQuestionsReq();
      this.props.resetAllRoundsAllQuestionsReq();
    }

    // If we deleted a round, get all questions and rounds
    if (this.props.deleted_round) {
      this.props.getAllRoundsReq();
      this.props.getAllQuestionsReq();
      this.props.resetAllRoundsAllQuestionsReq();
    }
  };
  render() {
    console.log("this.state: ", this.state);
    return (
      <div>
        {/* Map over questions and display questions with highlighted correct answer*/}
        {this.state.rounds.map((round, index) => {
          let questions = this.state.questions.filter(
            question => question.rounds_id === round.id
          );
          return (
            <div>
              {index !== 0 ? <div className="page-break" /> : null}
              <div className="hiddenAnswers-info">
                <div>
                  {this.props.game ? this.props.game.gamename : "No Game Name"}
                </div>
                <div>{round.name}</div>
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

              <RoundAnswers
                questions={questions}
                userSheets={this.props.userSheets}
              />
            </div>
          );
        })}
      </div>
    );
  }
}

const mapStateToProps = ({ gamesList }) => {
  return {
    all_rounds: gamesList.all_rounds,
    all_questions: gamesList.all_questions,
    saved_round: gamesList.saved_round,
    saved_questions: gamesList.saved_questions,
    deleted_round: gamesList.deleted_round
  };
};

export default connect(
  mapStateToProps,
  { getAllRoundsReq, getAllQuestionsReq, resetAllRoundsAllQuestionsReq }
)(PrintAllAnswerKey);
