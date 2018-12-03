import React, { Component } from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { fetchGameReq } from "../actions";
import EditGameView from "./EditGameView";
import RoundsList from "./RoundsList";

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
      rounds: [
        // {
        //     id: 0,
        //     title: "Round One",
        //     numberOfQs: 10,
        //     category: "",
        //     difficulty: "",
        //     type: ""
        // }
      ]
    };
  }

  componentDidMount() {
    const id = Number(this.props.match.params.id);
    this.props.fetchGameReq(id);
  }

  componentDidUpdate = prevProps => {
    if (prevProps.game !== this.props.game) {
      console.log("prevProps.game: ", prevProps.game);
      console.log("this.props.game: ", this.props.game);
      this.setState({ game: this.props.game });
    }
  };

  render() {
    // if (!this.props.game) return <div>Loading...</div>;

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
          <div>
            <EditGameView game={this.props.game} />
            <RoundsList id={this.props.match.params.id} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ gamesList }) => {
  return {
    game: gamesList.game[0]
    // rounds: gamesList.game.rounds
  };
};

export default connect(
  mapStateToProps,
  { fetchGameReq }
)(Game);
