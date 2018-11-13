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
            gamesList: [],
            roundId: 0,
            roundsList: [
                // {
                //     id: "1",
                //     title: "Game 1",
                //     description: "Game 1",
                //     image: "",
                //     created: "",
                //     played: "",
                //     rounds: [{ questions: [] }]
                // },
                // {
                //     id: "2",
                //     title: "Game 2",
                //     description: "Game 2",
                //     image: "",
                //     created: "",
                //     played: ""
                // }
            ]
        };
    }

    handleGameId = () => {
        if (this.state.gamesList.length > 0) {
            this.setState({ gameId: this.state.gameId + 1 });
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
                <Route path="/game/:id" component={Game} />
                <Route path="/game/:id/round/:id" component={Round} />
            </div>
        );
    }
}

export default withRouter(App);
