import React, { Component } from "react";
import { Link } from "react-router-dom";
import Rounds from "./Rounds";
import { connect } from "react-redux";
import { fetchRoundsReq } from "../actions";

/**
 * RoundsList Component
 * - renders a list of rounds for the selected game
 */
class RoundsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rounds: []
    };
  }

  componentDidMount() {
    const id = Number(this.props.id);
    console.log(id);

    this.props.fetchRoundsReq(id);
  }

  render() {
    return (
      <div>
        {this.props.fetchingRounds === true ? (
          "Loading...."
        ) : (
          <div>
            {this.props.rounds.map((round, i) => (
              <div>
                <Rounds key={round["id"]} index={i} round={round} />
              </div>
            ))}

            <div>
              <div>New Round</div>
              <button onClick={this.newRound}>+</button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ gamesList }) => {
  return {
    fetchingRounds: gamesList.fetching_rounds,
    fetchedRounds: gamesList.fetched_rounds,
    error: gamesList.error,
    rounds: gamesList.rounds
  };
};

export default connect(
  mapStateToProps,
  { fetchRoundsReq }
)(RoundsList);
