import {
  FETCHING_GAMES,
  FETCHED_GAMES,
  FETCHING_GAME,
  FETCHED_GAME,
  FETCHING_ROUNDS,
  FETCHED_ROUNDS,
  FETCHING_SAVED_QUESTIONS,
  FETCHED_SAVED_QUESTIONS,
  FETCHING_NEW_QUESTIONS,
  FETCHED_NEW_QUESTIONS,
  SAVING_GAME,
  SAVED_GAME,
  DELETING_GAME,
  DELETED_GAME,
  UPDATING_GAME,
  UPDATED_GAME,
  SAVING_ROUND,
  SAVED_ROUND,
  DELETING_ROUND,
  DELETED_ROUND,
  EDITING_ROUND,
  EDITED_ROUND,
  SAVING_QUESTIONS,
  SAVED_QUESTIONS,
  DELETING_QUESTIONS,
  DELETED_QUESTIONS,
  RESET,
  RESET_NEW_QUESTIONS,
  ERROR
} from "../actions";
import { combineReducers } from "redux";

const initialState = {
  games: [],
  game: [],
  rounds: [],
  round: null,
  questions: [],
  new_questions: [],
  question: [],
  invoiced: [],
  gameName: null,
  gameId: null,
  roundId: null,
  roundName: null,
  numberOfQuestions: null,
  category: null,
  difficulty: null,
  type: null,
  fetching_games: false,
  fetched_games: false,
  fetching_game: false,
  fetched_game: false,
  fetching_rounds: false,
  fetched_rounds: false,
  fetching_saved_questions: false,
  fetched_saved_questions: false,
  fetching_new_questions: false,
  fetched_new_questions: false,
  deleting_questions: false,
  deleting_questions: false,
  saving_game: false,
  saved_game: false,
  saving_round: false,
  saved_round: false,
  saving_questions: false,
  saved_questions: false,
  updating_game: false,
  updated_game: false,
  deleting_game: false,
  deleted_game: false,
  deleting_round: false,
  deleted_round: false,
  editing_round: false,
  edited_round: false,
  error: null
};

const gamesReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCHING_GAMES:
      return Object.assign({}, state, {
        fetching_games: true
      });
    case FETCHED_GAMES:
      return Object.assign({}, state, {
        fetching_games: false,
        fetched_games: true,
        games: action.payload
      });
    case FETCHING_GAME:
      return Object.assign({}, state, {
        fetching_game: true
      });
    case FETCHED_GAME:
      return Object.assign({}, state, {
        fetching_game: false,
        fetched_game: true,
        game: action.payload,
        gameId: action.payload[0].gameId,
        gameName: action.payload[0].gamename
      });
    case FETCHING_ROUNDS:
      return Object.assign({}, state, {
        fetching_rounds: true,
        fetched_rounds: false
      });
    case FETCHED_ROUNDS:
      return Object.assign({}, state, {
        fetching_rounds: false,
        fetched_rounds: true,
        rounds: action.payload
      });
    case SAVING_GAME:
      return Object.assign({}, state, {
        saving_game: true
      });
    case SAVED_GAME:
      return Object.assign({}, state, {
        saving_game: false,
        saved_game: true,
        // games: action.payload
        gameId: action.payload
      });
    case UPDATING_GAME:
      return Object.assign({}, state, {
        updating_game: true
      });
    case UPDATED_GAME:
      return Object.assign({}, state, {
        updating_game: false,
        updated_game: true,
        game: action.payload
      });
    case DELETING_GAME:
      return Object.assign({}, state, {
        deleting_game: true
      });
    case DELETED_GAME:
      return Object.assign({}, state, {
        deleting_game: false,
        deleted_game: true,
        games: action.payload
      });
    case SAVING_ROUND:
      return Object.assign({}, state, {
        saving_round: true,
        saved_round: false
      });
    case SAVED_ROUND:
      console.log("action.payload!!", action.payload);
      let newRounds = state.rounds.slice();
      newRounds.push(action.payload);
      return Object.assign({}, state, {
        saving_round: false,
        saved_round: true,
        rounds: newRounds,
        round: action.payload,
        roundId: action.payload.roundId
      });
    case DELETING_ROUND:
      return Object.assign({}, state, {
        deleting_round: true,
        deleted_round: false
      });
    case DELETED_ROUND:
      let reducedRounds = state.rounds.slice();
      reducedRounds = reducedRounds.filter(
        round => round.roundId !== action.payload
      );
      return Object.assign({}, state, {
        deleting_round: false,
        deleted_round: true,
        rounds: reducedRounds
      });
    case EDITING_ROUND:
      return Object.assign({}, state, {
        editing_round: true,
        edited_round: false
      });
    case EDITED_ROUND:
      let editedRounds = state.rounds.slice();
      // Replaces the old Round in Redux store with new, modified round from database
      editedRounds = editedRounds.map(round => {
        if (round.roundId === action.payload.roundId) {
          return action.payload;
        } else {
          return round;
        }
      });
      return Object.assign({}, state, {
        editing_round: false,
        edited_round: true,
        rounds: editedRounds,
        round: action.payload,
        roundId: action.payload.roundId
      });
    case FETCHING_NEW_QUESTIONS:
      return Object.assign({}, state, {
        fetching_new_questions: true,
        fetched_new_questions: false
      });
    case FETCHED_NEW_QUESTIONS:
      return Object.assign({}, state, {
        fetching_new_questions: false,
        fetched_new_questions: true,
        new_questions: action.payload.results
      });
    case FETCHING_SAVED_QUESTIONS:
      return Object.assign({}, state, {
        fetching_saved_questions: true,
        fetched_saved_questions: false
      });
    case FETCHED_SAVED_QUESTIONS:
      console.log("action.payload", action.payload);
      return Object.assign({}, state, {
        fetching_saved_questions: false,
        fetched_saved_questions: true,
        roundId: action.payload.roundId,
        roundName: action.payload.roundName,
        numberOfQuestions: action.payload.numberOfQuestions,
        category: action.payload.category,
        difficulty: action.payload.difficulty,
        type: action.payload.type,
        questions: action.payload.questions
      });
    case SAVING_QUESTIONS:
      return Object.assign({}, state, {
        saving_questions: true,
        saved_questions: false
      });
    case SAVED_QUESTIONS:
      return Object.assign({}, state, {
        saving_questions: false,
        saved_questions: true,
        fetched_new_questions: false
      });
    // This resets the state in Rounds.js to avoid
    // triggering a push in componentDidUpdate when not necessary
    case RESET:
      console.log("RESET CALLED!!");
      return Object.assign({}, state, {
        fetched_saved_questions: false,
        roundName: null,
        roundId: null
      });
    case RESET_NEW_QUESTIONS:
      console.log("RESET New  Questions CALLED!!");
      return Object.assign({}, state, {
        fetched_new_questions: false
      });
    case ERROR:
      return Object.assign({}, state, {
        error: action.payload
      });
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  gamesList: gamesReducer
});

export default rootReducer;
