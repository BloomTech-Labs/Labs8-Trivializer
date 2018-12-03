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
export const FETCHING_ROUNDS = "FETCHING_ROUNDS";
export const FETCHED_ROUNDS = "FETCHED_ROUNDS";
export const SAVING_ROUND = "SAVING_ROUND";
export const SAVED_ROUND = "SAVED_ROUND";
export const DELETING_ROUND = "DELETING_ROUND";
export const DELETED_ROUND = "DELETED_ROUND";
export const EDITING_ROUND = "EDITING_ROUND";
export const EDITED_ROUND = "EDITED_ROUND";
export const FETCHING_QUESTIONS = "FETCHING_QUESTIONS";
export const FETCHED_QUESTIONS = "FETCHED_QUESTIONS";
export const RESET = "RESET";
export const ERROR = "ERROR";

const URL = process.env.REACT_APP_API_URL || "https://opentdb.com/api.php?";
const BE_URL =
  process.env.REACT_APP_BE_URL || "https://testsdepl.herokuapp.com/users";

// sample games fetch with params
// {
//     username: "username"
// }

export const fetchGamesReq = () => {
  const newGames = {
    username: `${sessionStorage.getItem("user")}`
  };

  return dispatch => {
    dispatch({ type: FETCHING_GAMES });
    axios
      .post(`${BE_URL}/games`, newGames, {
        headers: {
          Authorization: `${sessionStorage.getItem("jwt")}`
        }
      })
      .then(({ data }) => {
        // return if null properties
        if (!data[0]["gameId"]) {
          return;
        }

        dispatch({ type: FETCHED_GAMES, payload: data });
      })
      .catch(err => {
        dispatch({ type: ERROR, payload: err });
      });
  };
};

export const fetchGameReq = id => {
  const newGames = {
    username: `${sessionStorage.getItem("user")}`
  };

  return dispatch => {
    dispatch({ type: FETCHING_GAME });
    axios
      .post(`${BE_URL}/games`, newGames, {
        headers: {
          Authorization: `${sessionStorage.getItem("jwt")}`
        }
      })
      .then(({ data }) => {
        // filter game by id
        const result = data.filter(item => item.gameId === id);

        dispatch({ type: FETCHED_GAME, payload: result });
      })
      .catch(err => {
        dispatch({ type: ERROR, payload: err });
      });
  };
};

// sample game submit
// {
//     "username": "user",
//     "gameName": "game one",
//     "created": 1542422323472,
//     "description": "This is a game"
//     "played": 1542422323472
// }

export const submitGameReq = game => {
  const newGame = {
    username: game.username,
    gameName: game.gameTitle,
    created: game.gameCreatedMS,
    description: game.gameDescription,
    played: game.gameScheduledMS
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
        dispatch({ type: DELETED_GAME, payload: data });
      })
      .catch(err => {
        console.log(err);
        dispatch({ type: ERROR, payload: err });
      });
  };
};

// sample game update
// {
//     "username": "user",
//     "gameName": "game one",
//     "created": 1542422323472,
//     "description": "This is a game",
//     "played": 1542422323472,
//     "rounds": []
// }

export const updateGameReq = (id, game) => {
  const newGame = {
    username: game.username,
    gameName: game.gameTitle,
    dateCreated: game.gameCreatedMS,
    description: game.gameDescription,
    datePlayed: game.gameScheduledMS,
    rounds: []
  };

  return dispatch => {
    dispatch({ type: UPDATING_GAME });
    axios
      .put(`${BE_URL}/editgame/${id}`, newGame, {
        headers: {
          Authorization: `${sessionStorage.getItem("jwt")}`
        }
      })
      .then(({ data }) => {
        // console.log(data);
        // format result
        // const result = {
        //   gameId: data.gameId,
        //   gamename: data.gamename,
        //   description: data.description,
        //   dateCreated: data.dateCreated,
        //   datePlayed: data.datePlayed
        // };
        // dispatch({ type: UPDATED_GAME, payload: result });
      })
      .catch(err => {
        console.log(err);
        dispatch({ type: ERROR, payload: err });
      });
    // fetchGameReq(id);
  };
};

export const fetchRoundsReq = id => {
  return dispatch => {
    dispatch({ type: FETCHING_ROUNDS });
    axios
      .get(`${BE_URL}/rounds/${id}`, {
        headers: {
          Authorization: `${sessionStorage.getItem("jwt")}`
        }
      })
      .then(({ data }) => {
        if (!data[0]["roundId"]) {
          data = [];
        }
        dispatch({ type: FETCHED_ROUNDS, payload: data });
      })
      .catch(err => {
        dispatch({ type: ERROR, payload: err });
      });
  };
};

export const saveRoundReq = round => {
  console.log(round);
  return dispatch => {
    dispatch({ type: SAVING_ROUND });
    axios
      .post(`${BE_URL}/round`, round, {
        headers: {
          Authorization: `${sessionStorage.getItem("jwt")}`
        }
      })
      .then(({ data }) => {
        dispatch({ type: SAVED_ROUND, payload: data });
      })
      .catch(err => {
        dispatch({ type: ERROR, payload: err });
      });
  };
};

// Takes in a round Id and returns that same Id to
// delete the round from Redux store in Reducers, index.js
export const deleteRoundReq = roundId => {
  return dispatch => {
    dispatch({ type: DELETING_ROUND });
    axios
      .delete(`${BE_URL}/round/${roundId}`, {
        headers: {
          Authorization: `${sessionStorage.getItem("jwt")}`
        }
      })
      .then(({ data }) => {
        dispatch({ type: DELETED_ROUND, payload: roundId });
      })
      .catch(err => {
        dispatch({ type: ERROR, payload: err });
      });
  };
};

export const editRoundReq = (round, roundId) => {
  return dispatch => {
    dispatch({ type: EDITING_ROUND });
    axios
      .put(`${BE_URL}/round/${roundId}`, round, {
        headers: {
          Authorization: `${sessionStorage.getItem("jwt")}`
        }
      })
      .then(({ data }) => {
        dispatch({ type: EDITED_ROUND, payload: data });
      })
      .catch(err => {
        dispatch({ type: ERROR, payload: err });
      });
  };
};

export const getQuestionsReq = (info, roundId) => {
  console.log("info: ", info);

  return dispatch => {
    console.log("IN dispatch, getQuestionsReq");
    dispatch({ type: FETCHING_QUESTIONS });
    axios
      .get(`${BE_URL}/questions/${roundId}`, {
        headers: {
          Authorization: `${sessionStorage.getItem("jwt")}`
        }
      })
      .then(({ data }) => {
        console.log("data: ", data);
        // If we have results from the USers API, assign questions to our info packet
        if (data[0] && data[0].questionId !== null) {
          info.questions = data;
        }
        // Send info packet, either with new questions or original (should be empty array)
        dispatch({ type: FETCHED_QUESTIONS, payload: info });
      })
      .catch(err => {
        console.log("err.message getQuestionsReq: ", err.message);
        dispatch({ type: ERROR, payload: err });
      });
  };
};

export const resetRoundStateReq = () => {
  return dispatch => {
    dispatch({ type: RESET });
  };
};
