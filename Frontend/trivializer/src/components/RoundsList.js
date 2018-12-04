import React, { Component } from "react";
import Rounds from "./Rounds";
import { connect } from "react-redux";
import { fetchRoundsReq, saveRoundReq } from "../actions";
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
  }

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
    fetchingRounds: gamesList.fetching_rounds,
    fetchedRounds: gamesList.fetched_rounds,
    error: gamesList.error,
    rounds: gamesList.rounds
  };
};

export default connect(
  mapStateToProps,
  { fetchRoundsReq, saveRoundReq }
)(RoundsList);
