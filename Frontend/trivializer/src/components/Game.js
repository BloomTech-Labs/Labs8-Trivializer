import React, { Component } from "react";
import Navbar from "./Navbar";
import Rounds from "./Rounds";
import { Link } from "react-router-dom";

/**
 * Game Component
 * - renders selected game with an EditGameView and RoundsList Components
 */
class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            game: null,
            curGameId: "",
            gameTitle: "",
            gameDescription: "",
            gameDate: "",
            roundId: 0,
            roundsList: [
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
        // implement redux actions later
        const result = this.props.gamesList.filter(game => game.id === id);
        console.log(result);
        if (result.length === 1) {
            this.setState({
                game: result[0],
                curGameId: id,
                gameTitle: result[0]["title"],
                gameDescription: result[0]["description"],
                gameDate: result[0]["played"]
            });
        }
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleCreateGame = () => {
        console.log("GAME CREATED");
        console.log(`GAME ID: ${this.props.match.params.id}`);
        // console.log(typeof this.props.match.params.id);
        // console.log(typeof this.props.gameId);
        // const gameId = Number(this.props.match.params.id);
        // const result = this.props.gamesList.filter(game => game.id === gameId);
        // console.log(result);

        const d = new Date();

        let game = {
            id: this.props.gameId,
            title: this.state.gameTitle,
            description: this.state.gameDescription,
            image: "",
            created: `${d.getMonth() + 1}-${d.getDate()}-${d.getFullYear()}`,
            played: this.state.gameDate,
            rounds: []
        };

        // change id to edit existing game
        if (this.state.game) {
            game.id = this.state.game.id;
        }

        this.props.handleSaveGame(game);
    };

    render() {
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
                            value={this.state.gameTitle}
                            onChange={this.handleChange}
                        />
                        <input
                            name="gameDescription"
                            placeholder="Game Description"
                            value={this.state.gameDescription}
                            onChange={this.handleChange}
                        />
                        <input
                            type="date"
                            name="gameDate"
                            placeholder="mm/dd/yyyy"
                            value={this.state.gameDate}
                            onChange={this.handleChange}
                        />
                        <button>Print Answer Sheets</button>
                        <button>Print Answer Key</button>
                        <button onClick={this.handleCreateGame}>
                            Save Game
                        </button>

                        {this.state.roundsList.length < 1 ? (
                            <div>
                                <h3 className="main-middle">Add New Round</h3>
                                <Link to={`/round/${this.state.roundId}`}>
                                    +
                                </Link>
                            </div>
                        ) : (
                            this.state.roundsList.map((round, i) => (
                                <div>
                                    <RoundDetails
                                        key={round["id"]}
                                        index={i}
                                        round={round}
                                    />
                                </div>
                            ))
                        )}

                        {this.state.roundsList.length > 1 ? (
                            <div>
                                <div>New Round</div>
                                <button>+</button>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        );
    }
}

function RoundDetails({ round }) {
    return (
        <div>
            <Rounds round={round} />
        </div>
    );
}

export default Game;
