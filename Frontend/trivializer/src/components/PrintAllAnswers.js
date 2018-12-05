import React, { Component } from "react";
import Questions from "./Questions";
import RoundAnswers from "./RoundAnswers";
import { connect } from "react-redux";
import {
  getAllRoundsReq,
  getAllQuestionsReq,
  resetAllRoundsAllQuestionsReq
} from "../actions";

class PrintAllAnswers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      answers: true,
      rounds: [],
      questions: []
    };
  }
  componentDidMount = () => {
    this.props.getAllRoundsReq();
    this.props.getAllQuestionsReq();
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
  };
  render() {
    return (
      <div>
        {/* Map over questions and display questions with highlighted correct answer*/}
        {this.state.rounds.map((round, index) => {
          let questions = this.state.questions.filter(
            question => question.rounds_id === round.id
          );
          console.log("questions: ", questions);
          return <RoundAnswers questions={questions} />;
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
    saved_questions: gamesList.saved_questions
  };
};

export default connect(
  mapStateToProps,
  { getAllRoundsReq, getAllQuestionsReq, resetAllRoundsAllQuestionsReq }
)(PrintAllAnswers);
