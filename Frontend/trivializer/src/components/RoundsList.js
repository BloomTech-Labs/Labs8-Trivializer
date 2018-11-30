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
      newRounds: []
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
    console.log("this.props.rounds!!!!!!: ", this.props.rounds);
    return (
      <div>
        {this.props.fetchingRounds === true ? (
          "Loading...."
        ) : (
          <div>
            <div className="roundsList">
              {this.props.rounds.map((round, i) => {
                return (
                  <div key={round.roundId}>
                    <Rounds index={i} round={round} />
                  </div>
                );
              })}

              {/* Loops throught the new rounds the user has created, not yet saved and thus not in Redux store */}
              {/* These are "fake rounds", as they are not yet in the database and only exist locally */}
              {this.state.newRounds.map((round, i) => {
                return (
                  <div key={Date.now()}>
                    {/* Should change date.now to something better later */}
                    <Rounds
                      new
                      index={this.props.rounds.length + i + 1}
                      round={round}
                    />
                  </div>
                );
              })}
              <div>
                <div>New Round</div>
                <button onClick={this.newRound}>+</button>
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
