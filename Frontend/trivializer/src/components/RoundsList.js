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
      newRoundHeight: null
    };
  }

  componentDidMount() {
    const id = Number(this.props.id);

    this.props.fetchRoundsReq(id);
    console.log("this.props RoundsList 1: ", this.props.new_questions);
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
          console.log(
            "prevProps.roundId, this.props.roundId: ",
            prevProps.roundId,
            this.props.roundId
          );
          console.log(
            "!prevProps.rounds.map(round => {return roundId}).includes(this.props.roundId): ",
            !prevProps.rounds
              .map(round => {
                return round.roundId;
              })
              .includes(this.props.roundId)
          );
          let formattedRound = {
            gameId: this.props.gameId,
            roundName: this.props.round.roundName,
            category: "",
            type: "multiple",
            difficulty: "easy",
            questions: 1
          };
          console.log("this.props.round: ", this.props.round);
          this.props.getNewQuestionsReq(formattedRound);
        }
      }
    }
    // If the following two are true, we have received questions from the QuestionsAPI,
    // Save them to the Users Database
    if (prevProps.new_questions !== this.props.new_questions) {
      if (this.props.fetched_new_questions) {
        console.log("CONDITION MET TO SAVE QUESTIONS!!!!");
        let round_id = this.props.round.roundId;
        let questionsPackage = this.props.new_questions.slice();
        questionsPackage = questionsPackage.map(question => {
          question.rounds_id = round_id;

          return question;
        });
        console.log("questionsPackage: ", questionsPackage);
        this.props.saveQuestionsReq(this.props.new_questions);
        this.props.resetFetchedNewQuestions();
      }
    }
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

    // Get the new questions, and set them to new_questions.
    // componentWillUpdate will detect when update occurs and save new questions
    // this.props.getNewQuestionsReq(formattedRound);
  };

  render() {
    return (
      <div>
        {this.props.fetchingRounds === true ? (
          "Loading...."
        ) : (
          <div>
            <div className="roundsList">
              {this.props.rounds.map((round, i, array) => {
                return (
                  <div key={round.roundId}>
                    <Rounds index={i} round={round} />
                  </div>
                );
              })}
              <div id="newRound">
                <div className="newRound-inner">
                  <div>New Round</div>
                  <button className="btn btn-primary" onClick={this.newRound}>
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
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
    fetchedRounds: gamesList.fetched_rounds,
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
