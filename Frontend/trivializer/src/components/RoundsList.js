import React, { Component } from "react";
import Rounds from "./Rounds";
import { connect } from "react-redux";
import {
  fetchRoundsReq,
  saveRoundReq,
  getNewQuestionsReq,
  saveQuestionsReq,
  resetFetchedNewQuestions
} from "../actions";
import "./Rounds.css";

/**
 * RoundsList Component
 * - renders a list of rounds for the selected game
 */
class RoundsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newRoundOuterHeight: null,
      newRoundWidth: null,
      newRoundHeight: null,
      roundLimit: 3
    };
  }

  componentDidMount() {
    const id = Number(this.props.id);

    this.props.fetchRoundsReq(id);
    console.log("this.props RoundsList 1: ", this.props.new_questions);
    if (sessionStorage.getItem("status") == 1) {
      this.setState({ roundLimit: 10 });
    }
  }

  componentDidUpdate = prevProps => {
    // ***** This is all to automatically save a new rounds questions in the
    // ***** Users database, so if a user creates a new round, then prints all
    // ***** rounds, the new rounds question will show

    // If the following two are true, we've saved a new Round and need to get it's questions
    if (
      prevProps.roundId !== this.props.roundId &&
      this.props.roundId !== null
    ) {
      if (this.props.savedRound) {
        // Checks to see that current roundId is not in the prevProps rounds, this means
        // That we have a new round
        if (
          !prevProps.rounds
            .map(round => {
              return round.roundId;
            })
            .includes(this.props.roundId)
        ) {
          console.log("CONDITION MET TO GET QUESTIONS!!!!");

          let formattedRound = {
            gameId: this.props.gameId,
            roundName: this.props.round.roundName,
            category: "",
            type: "multiple",
            difficulty: "easy",
            questions: 1
          };
          this.props.getNewQuestionsReq(formattedRound);
        }
      }
    }

    // If the following two are true, we have received questions from the QuestionsAPI,
    // Save them to the Users Database
    if (
      JSON.stringify(prevProps.new_questions) !==
      JSON.stringify(this.props.new_questions)
    ) {
      // if (this.props.fetched_new_questions) {
      console.log("CONDITION MET TO SAVE QUESTIONS!!!!");
      let round_id = this.props.roundId;
      let questionsPackage = this.props.new_questions.slice();
      questionsPackage = questionsPackage.map(question => {
        question.rounds_id = round_id;
        return question;
      });
      console.log(this.props.new_questions);
      this.props.saveQuestionsReq(this.props.new_questions);
      this.props.resetFetchedNewQuestions();
      // }
    }
    console.log(
      "prevProps.roundId, this.props.roundId: ",
      prevProps.roundId,
      this.props.roundId
    );
  };

  newRound = () => {
    let round = {
      gameId: this.props.gameId,
      roundName: "Default Value",
      category: "any",
      type: "multiple",
      difficulty: "easy",
      questions: 1
    };

    console.log("round: ", round);
    // Save the Round to the database with default values
    this.props.saveRoundReq(round);
  };

  render() {
    return (
      <div>
        <div className="roundsList">
          {this.props.rounds.map((round, i) => {
            return (
              <div key={round.roundId}>
                <Rounds index={i} round={round} />
              </div>
            );
          })}
          {this.props.rounds.length >= 0 &&
          this.props.rounds.length < this.state.roundLimit ? (
            <div id="newRound">
              <div className="newRound-inner">
                <div>New Round</div>
                <button className="btn btn-primary" onClick={this.newRound}>
                  +
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ gamesList }) => {
  return {
    gameId: gamesList.gameId,
    roundId: gamesList.roundId,
    savedRound: gamesList.saved_round,
    fetchingRounds: gamesList.fetching_rounds,
    error: gamesList.error,
    rounds: gamesList.rounds,
    round: gamesList.round,
    new_questions: gamesList.new_questions,
    fetched_new_questions: gamesList.fetched_new_questions
  };
};

export default connect(
  mapStateToProps,
  {
    fetchRoundsReq,
    saveRoundReq,
    getNewQuestionsReq,
    saveQuestionsReq,
    resetFetchedNewQuestions
  }
)(RoundsList);
