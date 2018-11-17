import React, { Component } from "react";
import Games from "./Games";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { fetchGamesReq } from "../actions";

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
        this.setState({ games: this.props.games });
    }

    render() {
        return (
            <div className="gameslist-page">
                <div className="top-content">
                    <div className="top-leftside">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link to="/">Home</Link>
                                </li>
                                <li
                                    className="breadcrumb-item active"
                                    aria-current="page"
                                >
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
                    {/* Ternary here should go: if [games] display <Games /> component, if NOT, display the add new game sign*/}
                    {this.state.games.length < 1 ? (
                        <div>
                            <h3 className="main-middle">Add New Game</h3>
                            <Link to={`/creategame`}>+</Link>
                        </div>
                    ) : (
                        this.state.games.map((game, i) => (
                            <Link to={`/game`}>
                                <GameDetails
                                    key={game["id"]}
                                    index={i}
                                    game={game}
                                />
                            </Link>
                        ))
                    )}
                    {this.state.games.length > 0 ? (
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
    console.log(gamesList);
    return {
        games: gamesList.games
    };
};

export default connect(
    mapStateToProps,
    { fetchGamesReq }
)(GamesList);
