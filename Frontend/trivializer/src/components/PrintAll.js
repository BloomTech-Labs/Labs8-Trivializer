import React, { Component } from "react";
import RoundAnswers from "./RoundAnswers";
import { connect } from "react-redux";
import "./PrintAll.css";
import {
  fetchRoundsReq,
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
    console.log("COMPONENTDIDMOUNT!!");
    this.props.fetchRoundsReq(this.props.gameId);
    // this.props.getAllRoundsReq();
    this.props.getAllQuestionsReq();
    // this.setState({
    //   rounds: this.props.all_rounds,
    //   questions: this.state.all_questions
    // });
    console.log("this.props PrintAll: ", this.props);
  };

  componentDidUpdate = (prevProps, prevState) => {
    // Check to see if rounds updated, If so, get new rounds
    // if (
    //   JSON.stringify(prevProps.all_rounds) !==
    //     JSON.stringify(this.props.all_rounds) &&
    //   this.props.all_rounds
    // ) {
    //   let rounds = this.props.all_rounds.filter(
    //     round => round.game_id === this.props.gameId
    //   );
    //   console.log("NEW ROUNDS!!!");
    //   console.log("rounds: ", rounds);

    //   this.setState({
    //     rounds: rounds
    //   });
    // }

    // Check to see if all questions updated, if so, get both new rounds and questions
    // this redundancy seems necessary to miss rounds that the first check missed
    // else if (
    //   JSON.stringify(prevProps.all_questions) !==
    //     JSON.stringify(this.props.all_questions) &&
    //   this.props.all_questions &&
    //   this.props.all_rounds
    // ) {
    //   // Check to see if our state's rounds and questions are in sync with
    //   // this.props's rounds and questions
    //   console.log("ALL_QUESTIONS DIFFERENT!!!!");
    //   let rounds = this.props.all_rounds.filter(
    //     round => round.game_id === this.props.gameId
    //   );

    //   let roundIds = rounds.map(round => round.id);

    //   let questions = this.props.all_questions.slice();

    //   questions.reduce((acc, question) => {
    //     if (roundIds.includes(question.rounds_id)) {
    //       acc.push(question);
    //     }
    //     return acc;
    //   }, []);

    //   console.log("questions: ", questions);

    //   this.setState({
    //     rounds: rounds,
    //     questions: questions
    //   });

    if (
      JSON.stringify(this.props.rounds) !== JSON.stringify(this.state.rounds) &&
      this.props.rounds
    ) {
      console.log(
        "this.props.rounds, this.state.rounds: ",
        this.props.rounds,
        this.state.rounds
      );
      // console.log(this.props.gameId);
      // let rounds = this.props.rounds.filter(
      //   round => round.game_id === this.props.gameId
      // );
      this.setState({ rounds: this.props.rounds });
    }
    if (
      JSON.stringify(this.props.all_questions) !==
        JSON.stringify(this.state.questions) &&
      this.props.all_questions
    ) {
      console.log("ALL_QUESTIONS DIFFERENT!!!!");
      let rounds = this.props.rounds.filter(
        round => round.game_id === this.props.gameId
      );

      let roundIds = rounds.map(round => round.id);

      let questions = this.props.all_questions.slice();

      questions.reduce((acc, question) => {
        if (roundIds.includes(question.rounds_id)) {
          acc.push(question);
        }
        return acc;
      }, []);

      console.log("questions: ", questions);

      this.setState({
        rounds: rounds,
        questions: questions
      });
    }

    // If The Redux store indicates that we have saved a new round
    // get rounds from the database
    if (
      this.props.saved_round &&
      (!this.props.fetching_rounds &&
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
      this.props.saved_questions && // !this.props.fetching_all_rounds &&
      (!this.props.fetching_rounds &&
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
    // if (!this.state.questions || !this.state.rounds) {
    //   this.setState();
    //   return null;
    // }
    return (
      <div>
        {/* Map over questions and display questions with highlighted correct answer*/}
        {this.state.rounds.map((round, index) => {
          let questions = this.state.questions.filter(
            question => question.rounds_id === round.roundId
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
    fetching_all_questions: gamesList.fetching_all_questions,
    fetching_rounds: gamesList.fetching_rounds
  };
};

export default connect(
  mapStateToProps,
  {
    fetchRoundsReq,
    getAllRoundsReq,
    getAllQuestionsReq,
    resetAllRoundsAllQuestionsReq
  }
)(PrintAll);
