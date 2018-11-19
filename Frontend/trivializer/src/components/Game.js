import React, { Component } from "react";
import Navbar from "./Navbar";
import Rounds from "./Rounds";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { fetchGameReq } from "../actions";

/**
 * Game Component
 * - renders selected game with an EditGameView and RoundsList Component
 */
class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            game: null,
            curGameId: "",
            gameTitle: "",
            gameDescription: "",
            gameScheduled: "",
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

        if (this.props.game) {
            this.setState({
                gameTitle: this.props.game.gamename,
                gameDescription: this.props.game.description,
                gameScheduled: this.props.game.datePlayed
            });
        }
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
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
                    <div>
                        <div>Logo</div>
                        <input
                            name="gameTitle"
                            placeholder="Game Title"
                            value={
                                this.state.gameTitle === ""
                                    ? this.props.game.gamename
                                    : this.state.gameTitle
                            }
                            onChange={this.handleChange}
                        />
                        <input
                            name="gameDescription"
                            placeholder="Game Description"
                            value={
                                this.state.gameDescription === ""
                                    ? this.props.game.description
                                    : this.state.gameDescription
                            }
                            onChange={this.handleChange}
                        />
                        <input
                            type="date"
                            name="gameScheduled"
                            placeholder="mm/dd/yyyy"
                            value={
                                this.state.gameScheduled === ""
                                    ? this.props.game.datePlayed
                                    : this.state.gameScheduled
                            }
                            onChange={this.handleChange}
                        />
                        <button>Print Answer Sheets</button>
                        <button>Print Answer Key</button>
                        <button onClick={this.handleCreateGame}>
                            Save Game
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ gamesList }) => {
    console.log(gamesList.game[0]);
    return {
        game: gamesList.game[0]
        // rounds: gamesList.game.rounds
    };
};

export default connect(
    mapStateToProps,
    { fetchGameReq }
)(Game);
