import React, { Component } from "react";
import RoundAnswers from "./RoundAnswers";
import { connect } from "react-redux";
import "./PrintAll.css";
import {
  getAllRoundsReq,
  getAllQuestionsReq,
  resetAllRoundsAllQuestionsReq
} from "../actions";

class PrintAll extends Component {
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
    // console.log(
    //   "JSON.stringify(prevProps.all_rounds) !== JSON.stringify(this.props.all_rounds))",
    //   JSON.stringify(prevProps.all_rounds) !==
    //     JSON.stringify(this.props.all_rounds)
    // );
    if (
      JSON.stringify(prevProps.all_rounds) !==
        JSON.stringify(this.props.all_rounds) &&
      this.props.all_rounds
    ) {
      let rounds = this.props.all_rounds.filter(
        round => round.game_id === this.props.gameId
      );
      console.log("NEW ROUNDS!!!");
      console.log("rounds: ", rounds);
      // let roundIds = rounds.map(round => round.id);
      // console.log("roundIds: ", roundIds);
      // console.log("this.props.all_questions: ", this.props.all_questions);
      // let questions = this.props.all_questions.slice();
      // questions.reduce((acc, question) => {
      //   if (roundIds.includes(question.rounds_id)) {
      //     acc.push(question);
      //   }
      // }, []);

      // console.log("questions: ", questions);

      this.setState({
        rounds: rounds
      });
    }

    // console.log(
    //   "JSON.stringify(prevProps.all_questions) !== JSON.stringify(this.props.all_questions",
    //   JSON.stringify(prevProps.all_questions) !==
    //     JSON.stringify(this.props.all_questions)
    // );

    if (
      JSON.stringify(prevProps.all_questions) !==
        JSON.stringify(this.props.all_questions) &&
      this.props.all_questions
    ) {
      let rounds = this.props.all_rounds.filter(
        round => round.game_id === this.props.gameId
      );

      let roundIds = rounds.map(round => round.id);

      let questions = this.props.all_questions.slice();

      questions.reduce((acc, question) => {
        console.log("acc: ", questions);
        if (roundIds.includes(question.rounds_id)) {
          acc.push(question);
        }
        return acc;
      }, []);

      this.setState({
        questions: questions
      });
    }

    // If The Redux store indicates that we have saved a new round
    // get rounds from the database
    if (
      this.props.saved_round &&
      (!this.props.fetching_all_rounds &&
        !this.props.fetching_all_questions &&
        !this.props.saving_questions &&
        !this.props.saving_round)
    ) {
      this.props.getAllQuestionsReq();
      this.props.getAllRoundsReq();
      this.props.resetAllRoundsAllQuestionsReq();
    }

    // If The Redux store indicates that we have saved new questions
    // get questions from the database
    if (
      this.props.saved_questions &&
      (!this.props.fetching_all_rounds &&
        !this.props.fetching_all_questions &&
        !this.props.saving_questions &&
        !this.props.saving_round)
    ) {
      this.props.getAllRoundsReq();
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
    console.log("this.state.questions: ", this.state.questions);
    console.log("this.state.rounds: ", this.state.rounds);
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
    gameId: gamesList.gameId,
    rounds: gamesList.rounds,
    all_rounds: gamesList.all_rounds,
    all_questions: gamesList.all_questions,
    saving_round: gamesList.saving_round,
    saved_round: gamesList.saved_round,
    saving_questions: gamesList.saving_questions,
    saved_questions: gamesList.saved_questions,
    deleted_round: gamesList.deleted_round,
    fetching_all_rounds: gamesList.fetching_all_rounds,
    fetching_all_questions: gamesList.fetching_all_questions
  };
};

export default connect(
  mapStateToProps,
  { getAllRoundsReq, getAllQuestionsReq, resetAllRoundsAllQuestionsReq }
)(PrintAll);
