import React, { Component } from "react";
import Games from "./Games";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";

class GamesList extends Component {
    constructor(props) {
        super(props);
        this.state = {};
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
                    {this.props.gamesList.length < 1 ? (
                        <div>
                            <h3 className="main-middle">Add New Game</h3>
                            <Link to={`/game/${this.props.gameId}`}>+</Link>
                        </div>
                    ) : (
                        this.props.gamesList.map((game, i) => (
                            <Link to={`/game`}>
                                <GameDetails
                                    key={game["id"]}
                                    index={i}
                                    game={game}
                                />
                            </Link>
                        ))
                    )}
                    {this.props.gamesList.length > 0 ? (
                        <div>
                            <div>New Game</div>
                            <Link to={`/game/${this.props.gameId}`}>+</Link>
                        </div>
                    ) : null}
                </div>
            </div>
        );
    }
}

function GameDetails({ game }) {
    return (
        <div>
            <Games game={game} />
        </div>
    );
}

export default GamesList;
