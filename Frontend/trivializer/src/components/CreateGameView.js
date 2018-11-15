import React, { Component } from "react";
import { Link } from "react-router-dom";
import NavBar from "./Navbar";

class CreateGameView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            description: "",
            created: "",
            played: ""
        };
    }

    componentDidMount() {
        const d = new Date();

        this.setState({
            title: "",
            description: "",
            created: `${d.getMonth() + 1}-${d.getDate()}-${d.getFullYear()}`,
            played: ""
        });
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
                    <NavBar />
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
                    </div>
                </div>
            </div>
        );
    }
}

export default CreateGameView;
