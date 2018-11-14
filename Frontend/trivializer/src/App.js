import React, { Component } from "react";
import "./App.css";
import LandingPage from "./components/LandingPage";
import Billing from "./components/Billing";
import GamesList from "./components/GamesList";
import Setting from "./components/Setting";
import Invoices from "./components/Invoices";
import Game from "./components/Game";
import { Route, withRouter } from "react-router-dom";
import Round from "./components/Round";

class App extends Component {
    constructor() {
        super();
        this.state = {
            gameId: 0,
            gamesList: [
                // {
                //     id: 0,
                //     title: Game 0,
                //     description: Game 0,
                //     image: "",
                //     created: "11-14-2018",
                //     played: "",
                //     rounds: []
                // }
            ],
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

    handleGameId = () => {
        if (this.state.gamesList.length > 0) {
            this.setState({ gameId: this.state.gameId + 1 });
        }
    };

    handleSaveGame = newGame => {
        const currentGamesList = this.state.gamesList;
        const result = currentGamesList.filter(
            game => game.title === newGame.title
        );
        if (result.length < 1) {
            console.log("GAME SAVED");
            this.setState({
                gamesList: [...this.state.gamesList, newGame],
                gameId: this.state.gameId + 1
            });
        }
    };

    render() {
        return (
            <div className="App">
                <Route exact path="/" component={LandingPage} />
                <Route path="/billing" component={Billing} />
                <Route
                    path="/gameslist"
                    render={props => (
                        <GamesList
                            {...props}
                            gameId={this.state.gameId}
                            gamesList={this.state.gamesList}
                        />
                    )}
                />
                <Route path="/setting" component={Setting} />
                <Route path="/invoices" component={Invoices} />
                <Route
                    path="/game/:id"
                    render={props => (
                        <Game
                            {...props}
                            handleSaveGame={this.handleSaveGame}
                            gameId={this.state.gameId}
                            gamesList={this.state.gamesList}
                        />
                    )}
                />
                <Route path="/game/:id/round/:id" component={Round} />
            </div>
        );
    }
}

export default withRouter(App);
