import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Rounds.css";
import { connect } from "react-redux";
import { saveRoundReq, deleteRoundReq } from "../actions";

let categoryOptions = {
  any: "any",
  "General Knowledge": "9",
  "Entertainment: Books": "10",
  "Entertainment: Film": "11",
  "Entertainment: Music": "12",
  "Entertainment: Musicals & Theatres": "13",
  "Entertainment: Television": "14",
  "Entertainment: Video Games": "15",
  "Entertainment: Board Games": "16",
  "Science & Nature": "17",
  "Science: Computers": "18",
  "Science: Mathematics": "19",
  Mythology: "20",
  Sports: "21",
  Geography: "22",
  History: "23",
  Politics: "24",
  Art: "25",
  Celebrities: "26",
  Animals: "27",
  Vehicles: "28",
  "Entertainment: Comics": "29",
  "Science: Gadgets": "30",
  "Entertainment: Japanese Anime & Manga": "31",
  "Entertainment: Cartoon & Animations": "32"
};

let difficultyOptions = {
  any: "any",
  easy: "easy",
  medium: "medium",
  hard: "hard"
};

let typeOptions = {
  any: "any",
  multiple: "Multiple choice",
  boolean: "True / False"
};

class Rounds extends Component {
  constructor(props) {
    super(props);
    this.state = {
      round: this.props.round,
      maxQuestions: 100,
      roundName: this.props.round.roundName,
      numQs: this.props.round.numQs,
      category: this.props.round.category,
      difficulty: this.props.round.difficulty,
      type: this.props.round.type,
      original_roundName: this.props.round.roundName,
      original_numQs: this.props.round.numQs,
      original_category: this.props.round.category,
      original_difficulty: this.props.round.difficulty,
      original_type: this.props.round.type,
      changed: false
    };
  }

  componentDidMount() {}

  componentDidUpdate = prevState => {
    if (prevState !== this.state) {
      // Compare values to original values, if any of them are different,
      // then we've made a change we can save, so set changed on state,
      // This will render a save button in render()
      if (
        !this.state.changed &&
        (this.state.roundName !== this.state.original_roundName ||
          this.state.numQs !== this.state.original_numQs ||
          this.state.category !== this.state.original_category ||
          this.state.difficulty !== this.state.original_difficulty ||
          this.state.type !== this.state.original_type)
      ) {
        this.setState({
          changed: true
        });
      }
      // Conversely, if the current state is all the same as the original,
      // remove the save button
      else if (
        this.state.changed &&
        (this.state.roundName === this.state.original_roundName &&
          this.state.numQs === this.state.original_numQs &&
          this.state.category === this.state.original_category &&
          this.state.difficulty === this.state.original_difficulty &&
          this.state.type === this.state.original_type)
      ) {
        this.setState({ changed: false });
      }
    }
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });

    // if (e.target.value !== this.state[`original_${e.target.name}`]) {
    //   this.setState({
    //     changed: true,
    //     [e.target.name]: e.target.value
    //   });
    // } else {
    //   this.setState({ [e.target.name]: e.target.value });
    // }
  };

  saveRound = () => {
    // Configure category to be the correct number value for the questions API
    // and users API, Users API must be a string, questions API needs a digit

    let formattedBackendRound = {
      gameId: this.props.gameId,
      roundname: this.state.roundName,
      category: this.state.category,
      type: this.state.type,
      difficulty: this.state.difficulty,
      questions: this.state.numQs
    };

    // Add extra check to be sure we have the gameId before hitting API
    if (this.props.gameId) {
      this.props.saveRoundReq(formattedBackendRound);
    } else {
      console.log("No game ID!!");
    }
  };

  delete = () => {
    this.props.deleteRoundReq(this.props.round.roundId);
  };

  render() {
    return (
      <div className="rounds">
        <input
          type="text"
          onChange={this.handleChange}
          name="roundName"
          value={this.state.roundName}
          className="roundsTitle"
        />
        {/* Number of Questions */}
        <div className="dropdown">
          <label htmlFor="numQs">Number of Questions</label>
          <select
            name="numQs"
            value={this.state.numQs}
            onChange={this.handleChange}
            id="numQs"
            className="select"
          >
            {[...Array(this.state.maxQuestions).keys()].map((number, i) => {
              number = number + 1;

              return (
                <option key={i} value={number}>
                  {number}
                </option>
              );
            })}
          </select>
        </div>
        {/* Categories */}
        <div className="dropdown">
          <label htmlFor="categories">Category</label>
          <select
            id="categories"
            name="category"
            value={this.state.category}
            onChange={this.handleChange}
            className="select"
          >
            {Object.keys(categoryOptions).map((option, i) => {
              return (
                <option key={i} className="roundsOption">
                  {option}
                </option>
              );
            })}
          </select>
        </div>
        {/* Difficulty */}
        <div className="dropdown">
          <label htmlFor="difficulty">Difficulty</label>
          <select
            id="difficulty"
            name="difficulty"
            value={this.state.difficulty}
            onChange={this.handleChange}
            className="select"
          >
            {Object.keys(difficultyOptions).map((option, i) => {
              return (
                <option key={i} value={option}>
                  {difficultyOptions[option]}
                </option>
              );
            })}
          </select>
        </div>
        {/* Type */}
        <div className="dropdown">
          <label htmlFor="type">Type</label>
          <select
            id="type"
            name="type"
            value={this.state.type}
            onChange={this.handleChange}
            className="select"
          >
            {Object.keys(typeOptions).map((option, i) => {
              return (
                <option key={i} value={option}>
                  {typeOptions[option]}
                </option>
              );
            })}
          </select>
        </div>
        <div className="roundsButtons">
          <button
            onClick={this.saveRound}
            className={`roundsSave ${this.state.changed ? null : "hidden"}`}
          >
            Save
          </button>
          <button className="roundsDelete" onClick={this.delete}>
            Delete
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ gamesList }) => {
  return {
    gameId: gamesList.game_id,
    savingRound: gamesList.saving_round,
    savedRound: gamesList.saved_round,
    error: gamesList.error,
    rounds: gamesList.rounds
  };
};

export default connect(
  mapStateToProps,
  { saveRoundReq, deleteRoundReq }
)(Rounds);
