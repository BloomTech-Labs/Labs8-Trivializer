import axios from "axios";
export const FETCHING_GAMES = "FETCHING_GAMES";
export const FETCHED_GAMES = "FETCHED_GAMES";
export const FETCHING_GAME = "FETCHING_GAME";
export const FETCHED_GAME = "FETCHED_GAME";
export const SAVING_GAME = "SAVING_GAME";
export const SAVED_GAME = "SAVED_GAME";
export const DELETING_GAME = "DELETING_GAME";
export const DELETED_GAME = "DELETED_GAME";
export const UPDATING_GAME = "UPDATING_GAME";
export const UPDATED_GAME = "UPDATED_GAME";
export const ERROR = "ERROR";

const URL = process.env.REACT_APP_API_URL;
const BE_URL = process.env.REACT_APP_BE_URL;

export const fetchGamesReq = () => {
    return dispatch => {
        dispatch({ type: FETCHING_GAMES });
        axios
            .get(`${URL}/games`)
            .then(({ data }) => {
                console.log(data);
                dispatch({ type: FETCHED_GAMES, payload: data });
            })
            .catch(err => {
                dispatch({ type: ERROR, payload: err });
            });
    };
};

export const fetchGameReq = id => {
    return dispatch => {
        dispatch({ type: FETCHING_GAME });
        axios
            .get(`${BE_URL}/game/${id}`)
            .then(({ data }) => {
                console.log(data);
                dispatch({ type: FETCHED_GAME, payload: data });
            })
            .catch(err => {
                console.log(err);
                dispatch({ type: ERROR, payload: err });
            });
    };
};

// sample game submit
// {
//     "username": "user",
//     "gameName": "game one",
//     "created": "11-15-2018",
//     "description": "This is a game"
// }

export const submitGameReq = game => {
    const newGame = {
        username: game.username,
        gameName: game.gameName,
        created: game.gameCreatedMS,
        description: game.gameDescription
    };

    return dispatch => {
        dispatch({ type: SAVING_GAME });
        axios
            .post(`${BE_URL}/creategame`, newGame, {
                headers: {
                    Authorization: `${sessionStorage.getItem("jwt")}`
                }
            })
            .then(({ data }) => {
                console.log(data);
                dispatch({ type: SAVED_GAME, payload: data });
            })
            .catch(err => {
                console.log(err);
                dispatch({ type: ERROR, payload: err });
            });
    };
};

export const deleteGameReq = id => {
    return dispatch => {
        dispatch({ type: DELETING_GAME });
        axios
            .get(`${BE_URL}/game/${id}`)
            .then(({ data }) => {
                console.log(data);
                dispatch({ type: DELETED_GAME, payload: data });
            })
            .catch(err => {
                console.log(err);
                dispatch({ type: ERROR, payload: err });
            });
    };
};

export const updateGameReq = id => {
    return dispatch => {
        dispatch({ type: UPDATING_GAME });
        axios
            .get(`${BE_URL}/game/${id}`)
            .then(({ data }) => {
                console.log(data);
                dispatch({ type: UPDATED_GAME, payload: data });
            })
            .catch(err => {
                console.log(err);
                dispatch({ type: ERROR, payload: err });
            });
    };
};
