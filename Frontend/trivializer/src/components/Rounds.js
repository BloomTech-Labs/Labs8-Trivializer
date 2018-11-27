import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Rounds.css";

let typeOptions = {
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

class Rounds extends Component {
  constructor(props) {
    super(props);
    this.state = {
      round: this.props.round,
      maxQuestions: 100
    };
  }

  componentDidMount = () => {
    if (this.props.new) {
    }
  };
  render() {
    return (
      <div className="rounds">
        <input
          type="text"
          value={this.state.round.roundName}
          className="roundsTitle"
        />
        {/* Number of Questions */}
        <div className="dropdown">
          <label htmlFor="numQs">Number of Questions</label>
          <select id="numQs" className="select">
            {[...Array(this.state.maxQuestions).keys()].map(number => {
              number = number + 1;
              let selected = number === this.state.round.numQs;
              return (
                <option selected={selected} value={number}>
                  {number}
                </option>
              );
            })}
          </select>
        </div>
        {/* Category Select Box */}
        <div className="dropdown">
          <label htmlFor="category">Category</label>
          <select id="category" className="select">
            {Object.keys(typeOptions).map(option => {
              let selected = option === this.state.round.category;
              return (
                <option selected={selected} value={typeOptions[option]}>
                  {option}
                </option>
              );
            })}
          </select>
        </div>
        <button>Delete</button>
      </div>
    );
  }
}

export default Rounds;
