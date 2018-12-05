import React, { Component } from "react";
import Questions from "./Questions";

class RoundAnswers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      answers: true,
      rounds: [],
      questions: []
    };
  }
  componentDidMount = () => {};
  render() {
    // The following are for React Drag N Drop functionality
    const questions = this.props.questions;

    return (
      <div>
        {/* Map over questions and display questions with highlighted correct answer*/}
        {questions.map((question, index) => {
          return (
            <Questions key={question.id} index={index} question={question} />
          );
        })}
      </div>
    );
  }
}

const mapStateToProps = ({ gamesList }) => {
  return {
    roundId: gamesList.roundId,
    fetching_questions: gamesList.fetching_questions,
    fetched_questions: gamesList.fetched_questions,
    gameName: gamesList.gameName,
    gameId: gamesList.gameId,
    roundName: gamesList.roundName,
    numberOfQuestions: gamesList.numberOfQuestions,
    category: gamesList.category,
    difficulty: gamesList.difficulty,
    type: gamesList.type,
    questions: gamesList.questions
  };
};

export default connect(
  mapStateToProps,
  {}
)(PrintAllRounds);
