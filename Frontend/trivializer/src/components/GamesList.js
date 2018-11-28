import React, { Component } from "react";
import Games from "./Games";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { fetchGamesReq } from "../actions";
import "./Components.css";

/**
 * GamesList Component
 * - renders a list of games for the logged in user
 */
class GamesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      games: []
    };
  }

  componentDidMount() {
    this.props.fetchGamesReq();
    // NOTE: setState after API request doesn't render state in time
    // this.setState({ games: this.props.games });
    // SOLUTION: render with props directly
  }
  logout = e => {
    e.preventDefault();
    localStorage.clear();
    sessionStorage.clear();
    this.props.history.push("/");
  };

  render() {
    if (!this.props.games) {
      return <div>Loading...</div>;
    }

    return (
      <div className="gameslist-page">
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
          {localStorage.getItem("user") || sessionStorage.getItem("jwt") ? (
            <div onClick={this.logout} className="top-rightside">
              Sign Out
            </div>
          ) : null}
        </div>

        <div className="main-content">
          <Navbar />
          {/* Ternary here should go: if [games] display <Games /> component, if NOT, display the add new game sign*/}
          {!this.props.games[0] ? (
            <div>
              <h3 className="main-middle">Add New Game</h3>
              <Link to={`/creategame`}>+</Link>
            </div>
          ) : (
            this.props.games.map((game, i) => (
              <Link to={`/game/${game["gameId"]}`}>
                <GameDetails key={game["id"]} index={i} game={game} />
              </Link>
            ))
          )}
          {this.props.games.length > 0 ? (
            <div>
              <div>New Game</div>
              <Link to={`/creategame`}>+</Link>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

/**
 * GameDetails function
 * - helper function to render mapped properties for each game
 */
function GameDetails({ game }) {
  return (
    <div>
      <Games game={game} />
    </div>
  );
}

const mapStateToProps = ({ gamesList }) => {
  return {
    games: gamesList.games
  };
};

export default connect(
  mapStateToProps,
  { fetchGamesReq }
)(GamesList);
