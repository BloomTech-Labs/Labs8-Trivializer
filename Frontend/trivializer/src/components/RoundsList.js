import React, { Component } from "react";
import { Link } from "react-router-dom";
import Rounds from "./Rounds";
// import { connect } from "react-redux";
// import {} from "../actions";

/**
 * RoundsList Component
 * - renders a list of rounds for the selected game
 */
class RoundsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rounds: []
        };
    }

    componentDidMount() {
        // this.setState({
        //     rounds: [
        //         {
        //             id: 0,
        //             gameId: 0,
        //             numberOfQs: 10,
        //             category: "",
        //             type: "",
        //             difficulty: ""
        //         }
        //     ]
        // });
    }

    render() {
        return (
            <div>
                {this.props.rounds.length < 1 ? (
                    <div>
                        <h3 className="main-middle">Add New Round</h3>
                        <Link to={`/round/${this.state.roundId}`}>+</Link>
                    </div>
                ) : (
                    this.props.rounds.map((round, i) => (
                        <div>
                            <RoundDetails
                                key={round["id"]}
                                index={i}
                                round={round}
                            />
                        </div>
                    ))
                )}
                {this.props.rounds.length > 1 ? (
                    <div>
                        <div>New Round</div>
                        <button>+</button>
                    </div>
                ) : null}
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

// const mapStateToProps = ({ gamesList }) => {
//     console.log(gamesList);
//     return {
//         games: gamesList.games
//     };
// };

// export default connect(
//     mapStateToProps,
//     { fetchGamesReq }
// )(RoundsList);

export default RoundsList;
