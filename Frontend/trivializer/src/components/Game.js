import React, { Component } from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { fetchGameReq } from "../actions";
import EditGameView from "./EditGameView";
import RoundsList from "./RoundsList";
import "./Game.css";
import ReactToPrint from "react-to-print";
import RoundAnswers from "./RoundAnswers";
import PrintAllAnswers from "./PrintAllAnswers";

/**
 * Game Component
 * - renders selected game with an EditGameView and RoundsList Component
 */
class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      game: null,
      gameId: null,
      roundId: 0,
      rounds: []
    };
  }

  componentDidMount() {
    const id = Number(this.props.match.params.id);
    this.props.fetchGameReq(id);
    this.setState({ game: this.props.game, gameId: id });
  }

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
                <ReactToPrint
                  trigger={() => (
                    <button type="button" className="btn btn-primary round">
                      Print Answer Sheets
                    </button>
                  )}
                  content={() => this.answerSheetRef}
                />

                <button>Print Answer Key</button>
              </div>
            </div>

            <RoundsList id={this.props.match.params.id} />
          </div>
        </div>

        <div className="hidden">
          <PrintAllAnswers
            game={this.props.game}
            ref={el => (this.answerSheetRef = el)}
          />
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
