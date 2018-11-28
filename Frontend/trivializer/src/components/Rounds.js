import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./Rounds.css";
import { connect } from "react-redux";
import {
  saveRoundReq,
  deleteRoundReq,
  editRoundReq,
  getQuestionsReq
} from "../actions";

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
      roundName: this.props.round.roundName || "New Round",
      numQs: this.props.round.numQs || 1,
      category: this.props.round.category || "any",
      difficulty: this.props.round.difficulty || "any",
      type: this.props.round.type || "any",
      original_roundName: this.props.round.roundName || "New Round",
      original_numQs: this.props.round.numQs || 1,
      original_category: this.props.round.category || "any",
      original_difficulty: this.props.round.difficulty || "any",
      original_type: this.props.round.type || "any",
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
        this.state.roundName.length > 0 &&
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
  };

  saveRound = () => {
    if (!this.props.gameId) {
      console.log("No game ID!!");
      return;
    }
    // Assemble backend info
    let formattedBackendRound = {
      gameId: this.props.gameId,
      roundName: this.state.roundName,
      category: this.state.category,
      type: this.state.type,
      difficulty: this.state.difficulty,
      questions: this.state.numQs
    };

    // ****** If this is a new round ******
    if (this.props.new || !this.props.round.roundId) {
      this.props.saveRoundReq(formattedBackendRound);
    }

    // ****** If this is an already saved round ******
    else {
      // Alter round instead of saving a new one, take in above info and existing round ID
      this.props.editRoundReq(formattedBackendRound, this.props.round.roundId);
    }
  };

  delete = () => {
    this.props.deleteRoundReq(this.props.round.roundId);
  };

  enterRound = () => {
    // First, save the round
    this.saveRound();

    // Get all of our info in the right format to call the questions API
    let formattedQuestionsRound = this.formatQuestionsCall();

    this.props.getQuestionsReq(
      formattedQuestionsRound,
      this.props.round.roundId
    );


    this.props.history.push(
      `${this.props.gameId}/round/${this.props.round.roundId}`
    );
    
  };

  // Format our current state to be set to Redux store
  // These values should be exactly what we send to the questions
  // API, so all "any" values should be "", all category options
  // Should be their numeric equivalent
  formatQuestionsCall = () => {
    let formattedQuestionsRound = {
      gameName: this.props.gameName !== null ? this.props.gameName : "Game",
      gameId: this.props.gameId,
      roundName:
        this.state.roundName !== "" ? this.props.roundName : "New Round",
      numberOfQuestions: this.state.numQs > 0 ? this.state.numQs : 1,
      category: categoryOptions[this.state.category],
      difficulty: this.state.difficulty !== "any" ? this.state.difficulty : "",
      type: this.state.type !== "any" ? this.state.type : "",
      questions: []
    };

    return formattedQuestionsRound;
  };

  render() {
    return (
      <div className="rounds" onDoubleClick={this.enterRound}>
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
    fetched_questions: gamesList.fetched_questions,
    gameId: gamesList.game_id,
    gameName: gamesList.gameName,
    savingRound: gamesList.saving_round,
    savedRound: gamesList.saved_round,
    error: gamesList.error,
    rounds: gamesList.rounds
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    { saveRoundReq, deleteRoundReq, editRoundReq, getQuestionsReq }
  )(Rounds)
);
