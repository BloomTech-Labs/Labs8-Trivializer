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
import CreateGameView from "./components/CreateGameView";

class App extends Component {
    constructor() {
        super();
        this.state = {
            gameId: 0,
            gamesList: [],
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
                <Route path="/creategame" component={CreateGameView} />
                <Route path="/setting" component={Round} />
                <Route path="/invoices" component={Invoices} />
                <Route path="/game/:id" component={Game} />
                <Route path="/game/:id/round/:id" component={Round} />
            </div>
        );
    }
}

export default withRouter(App);
