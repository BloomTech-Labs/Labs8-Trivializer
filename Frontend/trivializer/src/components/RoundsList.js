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

    if (this.lastRoundRef) {
      console.log("lastRoundRef!!");
      this.setState({ newRoundOuterHeight: this.lastRoundRef.clientHeight });
    }
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

  // Receives the width/height of the last Rounds component
  // To set newRounds buttonn width/height
  getWidthHeight = (width, height) => {
    console.log("width, height", width, height);
    this.setState({ newRoundWidth: width, newRoundHeight: height });
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
                  // lastRound and setRef are both for getting a ref to the last round, in order to match it's width and height for newRound buttons
                  <div
                    key={round.roundId}
                    ref={
                      i === array.length - 1
                        ? el => (this.lastRoundRef = el)
                        : null
                    }
                  >
                    <Rounds
                      index={i}
                      round={round}
                      lastRound={i === array.length - 1 ? true : false}
                      getWidthHeight={
                        i === array.length - 1 ? this.getWidthHeight : null
                      }
                    />
                  </div>
                );
              })}
              <div
                id="newRound"
                style={{
                  width: this.state.newRoundWidth,
                  height: this.state.newRoundOuterHeight
                }}
              >
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
