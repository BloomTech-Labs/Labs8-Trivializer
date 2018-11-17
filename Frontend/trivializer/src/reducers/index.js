import {
    FETCHING_GAMES,
    FETCHED_GAMES,
    FETCHING_GAME,
    FETCHED_GAME,
    SAVING_GAME,
    SAVED_GAME,
    DELETING_GAME,
    DELETED_GAME,
    UPDATING_GAME,
    UPDATED_GAME,
    ERROR
} from "../actions";
import { combineReducers } from "redux";

const initialState = {
    games: [],
    game: [],
    game_id: null,
    rounds: [],
    round: [],
    questions: [],
    question: [],
    invoiced: [],
    fetching_games: false,
    fetched_games: false,
    fetching_game: false,
    fetched_game: false,
    saving_game: false,
    saved_game: false,
    updating_game: false,
    updated_game: false,
    deleting_game: false,
    deleted_game: false,
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
                game: action.payload
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
                game_id: action.payload
            });
        case UPDATING_GAME:
            return Object.assign({}, state, {
                updating_game: true
            });
        case UPDATED_GAME:
            return Object.assign({}, state, {
                updating_game: false,
                updated_game: true,
                games: action.payload
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
