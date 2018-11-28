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
export const SAVING_ROUND = "SAVING_ROUNDS";
export const SAVED_ROUND = "SAVED_ROUNDS";
export const ERROR = "ERROR";

const URL = process.env.REACT_APP_API_URL || "https://testsdepl.herokuapp.com/users";
const BE_URL = process.env.REACT_APP_BE_URL || "https://testsdepl.herokuapp.com/users";

// const URL = "https://testsdepl.herokuapp.com/users";
// const URL = "http://localhost:3300/users";

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
      .post(`${URL}/games`, newGames, {
        headers: {
          Authorization: `${sessionStorage.getItem("jwt")}`
        }
      })
      .then(({ data }) => {
        console.log(data);

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
      .post(`${URL}/games`, newGames, {
        headers: {
          Authorization: `${sessionStorage.getItem("jwt")}`
        }
      })
      .then(({ data }) => {
        console.log(data);

        // filter game by id
        const result = data.filter(item => item.gameId === id);
        console.log(result);

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
      .post(`${URL}/creategame`, newGame, {
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
      .get(`${URL}/game/${id}`)
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
    gameName: game.gameName,
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
        console.log(data);

        // // format result
        // const result = {
        //     gameId: data[0]["id"],
        //     gamename: data[0]["gamename"],
        //     description: data[0]["description"],
        //     dateCreated: data[0]["date_created"],
        //     datePlayed: data[0]["date_played"]
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
  console.log("fetching Rounds!!!");
  return dispatch => {
    dispatch({ type: FETCHING_ROUNDS });
    axios
      .get(`${URL}/rounds/${id}`, {
        headers: {
          Authorization: `${sessionStorage.getItem("jwt")}`
        }
      })
      .then(({ data }) => {
        console.log("data: ", data);
        dispatch({ type: FETCHED_ROUNDS, payload: data });
      })
      .catch(err => {
        console.log("err: ", err);
        dispatch({ type: ERROR, payload: err });
      });
  };
};

export const saveRoundReq = (id, round) => {
  return dispatch => {
    dispatch({ type: SAVING_ROUND });
    axios.get(`${URL}`);
  };
};
