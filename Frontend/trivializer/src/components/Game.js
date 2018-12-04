import React, { Component } from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { fetchGameReq } from "../actions";
import EditGameView from "./EditGameView";
import RoundsList from "./RoundsList";
import "./Game.css";
import ReactToPrint from "react-to-print";

/**
 * Game Component
 * - renders selected game with an EditGameView and RoundsList Component
 */
class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      game: null,
      roundId: 0,
      rounds: []
    };
  }

  componentDidMount() {
    const id = Number(this.props.match.params.id);
    this.props.fetchGameReq(id);
  }

  printAll = () => {
    this.props.rounds.map();
  };

  render() {
    if (!this.props.game) return <div>Loading...</div>;

    return (
      <div className="game-page">
        <div className="top-content">
          <div className="top-leftside">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Games
                </li>
              </ol>
            </nav>
          </div>
          <Link className="top-rightside" to="/">
            Sign Out
          </Link>
        </div>

        <div className="main-content">
          <Navbar />
          <div className="editAndRounds">
            <div className="game-top">
              <EditGameView game={this.props.game} />

              <div className="game-buttons">
                <button>Print Answer Sheets</button>
                <button>Print Answer Key</button>
              </div>
            </div>

            <RoundsList id={this.props.match.params.id} />
          </div>
        </div>

        <div className="hidden">
          {/* Check if we have rounds on props (retrieved in RoundsList.js), and if so, prepare our printout without answers */}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ gamesList }) => {
  return {
    game: gamesList.game[0],
    rounds: gamesList.rounds
  };
};

export default connect(
  mapStateToProps,
  { fetchGameReq }
)(Game);
