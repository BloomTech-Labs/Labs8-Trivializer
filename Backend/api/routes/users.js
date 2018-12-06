const server = require("express")(); // sets up an express instance and returns a callback function
const db = require("../../data/db");
const utilities = require("../util/utilities");

var simplecrypt = require("simplecrypt");

var sc = simplecrypt({ password: process.env.SECRET });

const api_key = process.env.MAILGUN_API_KEY;
const domain = process.env.DOMAIN_NAME;
const mailgun = require("mailgun-js")({ apiKey: api_key, domain: domain });

// Base endpoint (at users/)
server.get("/", (req, res) => {
  res.json("App is currently functioning");
});

// Testing endpoints
// Get all users table
server.get("/users", (req, res) => {
  db("Users")
    .then(response => {
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Get all games table
server.get("/games", (req, res) => {
  db("Games")
    .then(response => {
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Get all Rounds table
server.get("/rounds", (req, res) => {
  db("Rounds")
    .then(response => {
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Get all Questions table
server.get("/questions", (req, res) => {
  db("Questions")
    .then(response => {
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Add new user
server.post("/register", async (req, res) => {
  // This table also includes credit card info, will handle in billing
  const { username, password, name, email, phone, logo } = req.body;

  // Encrypt password and add to package to be stored in Users table
  const hash = sc.encrypt(password);
  const credentials = {
    username: username,
    password: hash,
    email: email,
    name: name,
    phone: phone,
    logo: logo,
    paid: 0
  };

  try {
    // Try to insert the user
    let userId = await db("Users").insert(credentials);

    if (!userId) throw new Error("Unable to add that user");

    //mailgun api request
    const data = {
      from: "<trivializer@trivializer.com>",
      to: credentials.email,
      subject: "Welcome",
      text: "Welcome to Bar Trivia. Thank you for registering!"
    };
    mailgun.messages().send(data, function (error, body) {
      console.log(body);
    });

    // Generate a new token and return it
    let token = utilities.generateToken(username);
    res.status(201).json({ token: token, userId: userId[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login a user takes in username and password. Validates credentials
server.post("/login", utilities.getUser, async (req, res) => {
  let { username, password } = req.body;
  try {
    // Hit users table searching for username
    let user = await db("Users")
      .where({ username })
      .first();

    if (!user) throw new Error("Incorrect credentials");
    // decrypt the returned, hashed password
    decryptedPassword = sc.decrypt(user.password);

    // Check that passwords match
    if (decryptedPassword === password) {
      // Generate a new token and return it
      let token = utilities.generateToken(username);
      res.status(201).json({ token: token, userId: user.id, status: user.paid });
    } else {
      res.status(401).json({ error: "Incorrect Credentials" });
    }
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

// Creates a new game, takes in username, created, gameName and description (string)
server.post("/creategame", utilities.protected, async (req, res) => {
  try {
    const { username, created, gameName, description, played } = req.body;

    // Returns an array with a single user object, we just want the id here
    let user = await db("Users")
      .where({ username })
      .first();

    if (!user) throw new Error("No user by that name");

    // Get the id from the returned user object
    let userId = user.id;

    // Create package with all necessary fields for the Games table
    let gamePackage = {
      name: gameName,
      date_created: created,
      date_played: played === 0 ? 0 : played,
      user_id: userId,
      description: description
    };

    // inserting into games returns an array with 1 game ID if successful
    let gameId = (await db("Games").insert(gamePackage))[0];

    if (!gameId) throw new Error("Error creating new game");

    res.status(201).json(gameId);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// Saves a whole game, takes in the usernam, description, gamename, dateCreated, datePlayed, and rounds array
server.post("/save", utilities.protected, async (req, res) => {
  // Transactions allow us to perform multiple database calls, and if one of them doesn't work,
  // roll back all other calls. Maintains data consistency
  const { username, description, gamename, dateCreated, datePlayed, rounds } = req.body;

  try {
    // Get user
    await db.transaction(async trx => {
      let userId = await trx("Users")
        .where({ username })
        .first()
        .select("id"); // Get our user id based on username
      if (userId) userId = userId.id;
      else {
        throw new Error("username not found");
      }
      //Enter game info in DB with userID
      const gameInfo = {
        name: gamename,
        date_created: dateCreated,
        date_played: datePlayed,
        user_id: userId,
        description: description
      };

      let gameId = (await trx("Games").insert(gameInfo))[0];

      // Enter Rounds in Database

      // Assemble what we're going to insert in rounds table
      const roundsPackage = rounds.map(round => {
        return {
          name: round.roundName,
          category: round.category,
          type: round.type,
          difficulty: round.difficulty,
          number_of_questions: round.round.length,
          game_id: gameId
        };
      });

      let roundsPromises = roundsPackage.map(async round => {
        // Insert all rounds into game
        return (await trx("Rounds").insert(round))[0];
      });

      let roundsIds;

      await Promise.all(roundsPromises).then(values => {
        roundsIds = values;
      });

      // Insert questions/answers into database
      let questions = [];

      rounds.forEach((namedRound, index) => {
        namedRound.round.forEach(round => {
          questions.push({
            rounds_id: roundsIds[index],
            category: round.category,
            difficulty: round.difficulty,
            type: round.type,
            question: round.question,
            correct_answer: round.correct_answer,
            incorrect_answers: round.incorrect_answers.join("--")
          });
        });
      });

      let indicator = await trx("Questions").insert(questions);

      const returnGame = {
        gameId: gameId,
        gamename: gamename,
        description: description,
        dateCreated: dateCreated,
        datePlayed: datePlayed,
        rounds: rounds
      };
      res.status(200).json(returnGame);
    });
  } catch (err) {
    console.log("err.message: ", err.message);
    res.status(501).json({ error: err.message });
  }
});

// Updates a game, takes in username, created, played, gameName and description (string)
server.put("/editgame/:id", utilities.protected, async (req, res) => {
  try {
    const { id } = req.params;
    const edit = { ...req.body };

    // update game by id
    let game = await db("Games")
      .where("id", id)
      .update({
        name: edit.gameName,
        description: edit.description,
        date_played: edit.datePlayed
      });

    // get game by id
    let newGame = await db("Games").where("id", id);

    res.status(200).json({
      gameId: newGame[0]["id"],
      gamename: newGame[0]["name"],
      description: newGame[0]["description"],
      dateCreated: newGame[0]["date_created"],
      datePlayed: newGame[0]["date_played"]
    });
  } catch (err) {
    console.log("err.message: ", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get all games for a username passed in. Nedds a username passed in req.body
server.post("/games", utilities.getUser, utilities.protected, async (req, res) => {
  try {
    const id = req.userIn.id; // This is set in utilities.getUser

    let games = await db
      .select(
        "g.id as gameId",
        "g.name as gamename",
        "g.description as description",
        "g.date_created as dateCreated",
        "g.date_played as datePlayed"
      )
      .from("Users as u")
      .leftJoin("Games as g", "g.user_id", "u.id")
      .where("u.id", "=", id);

    res.status(200).json(games);
  } catch (err) {
    res.status(500).json({ error: "Problem getting games" });
  }
});

// Get all rounds for a game id passed in
server.get("/rounds/:id", utilities.protected, async (req, res) => {
  try {
    // Game Id passed in request URL
    const { id } = req.params;

    // Gets all rounds from the Rounds table where the game id matches the passed in ID
    let rounds = await db
      // Choose which columns we want to select, and assign an alias
      .select(
        "r.id as roundId",
        "r.name as roundName",
        "r.Number_of_questions as numQs",
        "r.category as category",
        "r.difficulty as difficulty",
        "r.type as type"
      )
      .from("Games as g")
      .leftJoin("Rounds as r", "r.game_id", "g.id")
      .where("g.id", "=", id);

    res.status(200).json(rounds);
  } catch (err) {
    res.status(500).json({ error: "Problem getting rounds" });
  }
});

// Delete a round based on round id
server.delete("/round/:id", utilities.protected, async (req, res) => {
  const { id } = req.params;
  try {
    // Returns the id of the deleted round
    let response = await db("Rounds")
      .where({ id })
      .del();

    // If response === 0 no round was deleted
    if (response === 0) throw new Error(`Error deleting round ${id}`);

    console.log("id: ", id);

    // delete all questions based on that round
    let responseQuestions = await db("Questions")
      .where({ rounds_id: id })
      .del();

    console.log("response, responseQuestions: ", response, responseQuestions);

    res.status(200).json(`Round ${response} deleted`);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a game based on game id
server.delete("/game/:id", utilities.protected, async (req, res) => {
    const { id } = req.params;
    try {
      // Returns the id of the deleted game
      let response = await db("Games")
        .where({ id })
        .del();
  
      // If response === 0 no game was deleted
      if (response === 0) throw new Error(`Error deleting game ${id}`);
  
      console.log("id: ", id);
  
  
      res.status(200).json(`Game ${response} deleted`);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

// Save a round
server.post("/round", utilities.protected, async (req, res) => {
  try {
    // Get all pertinent info from req.body
    const { gameId, roundName, category, difficulty, type, questions } = req.body;

    // Returns empty array if no game
    let validGame = await db("Games").where({ id: gameId });

    // Check to see if valid gameId
    if (validGame.length < 1) throw new Error("no Game by that ID");

    // Assemble round info to be entered in DB
    let roundPackage = {
      game_id: gameId,
      name: roundName,
      category: category,
      type: type,
      difficulty: difficulty,
      number_of_questions: questions
    };

    // Returns an array of 1 item, pull that item out with [0]
    let roundId = (await db("Rounds").insert(roundPackage))[0];

    let returnPackage = {
      roundId: roundId,
      roundName: roundName,
      numQs: questions,
      category: category,
      difficulty: difficulty,
      type: type
    };
    // Return new round ID
    res.status(200).json(returnPackage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a round by round id
server.put("/round/:id", utilities.protected, async (req, res) => {
  try {
    const { id } = req.params;
    const edit = { ...req.body };

    // update round by id
    let round = await db("Rounds")
      .where("id", id)
      .update({
        game_id: edit.gameId,
        name: edit.roundName,
        category: edit.category,
        type: edit.type,
        difficulty: edit.difficulty,
        number_of_questions: edit.questions
      });

    if (!round) {
      throw new Error("No Round with that ID");
    }

    // get round by id
    let newRound = await db("Rounds").where("id", id);

    res.status(200).json({
      roundId: newRound[0]["id"],
      roundName: newRound[0]["name"],
      numberOfQs: newRound[0]["number_of_questions"],
      category: newRound[0]["category"],
      difficulty: newRound[0]["difficulty"],
      type: newRound[0]["type"]
    });
  } catch (err) {
    console.log("err.message: ", err.message);
    res.status(500).json({ error: err.message });
  }
});

// edit a question by question ID
server.put("/editq/:id", utilities.protected, async (req, res) => {
  try {
    const { id } = req.params;
    const edit = { ...req.body };

    // update question by id
    let question = await db("Questions")
      .where("id", id)
      .update({
        category: edit.category,
        difficulty: edit.difficulty,
        type: edit.type,
        question: edit.question,
        correct_answer: edit.correctAnswer,
        incorrect_answers: edit.incorrectAnswers,
        answers: edit.answers
      });
    // get question by id
    let newQs = await db("Questions").where("id", id);

    res.status(200).json({
      questionId: newQs[0]["id"],
      category: newQs[0]["category"],
      difficulty: newQs[0]["difficulty"],
      type: newQs[0]["type"],
      question: newQs[0]["question"],
      correctAnswer: newQs[0]["correct_answer"],
      incorrectAnswers: newQs[0]["incorrect_answers"]
    });
  } catch (err) {
    console.log("err.message: ", err.message);
    res.status(500).json({ error: err.message });
  }
});

// edit a user by userID
server.put("/edituser/:id", utilities.protected, async (req, res) => {
  try {
    const { id } = req.params;
    const edit = { ...req.body };

    // update user by id
    let question = await db("Users")
      .where("id", id)
      .update({
        password: edit.password,
        name: edit.name,
        email: edit.email,
        phone: edit.phone,
        logo: edit.logo,
        paid: edit.paid,
        userName: edit.userName
      });
    // get user by id
    let newUser = await db("Users").where("id", id);

    res.status(200).json({
      userId: newUser[0]["id"],
      password: newUser[0]["password"],
      userName: newUser[0]["username"],
      name: newUser[0]["name"],
      email: newUser[0]["email"],
      phone: newUser[0]["phone"],
      logo: newUser[0]["logo"],
      paid: newUser[0]["paid"]
    });
  } catch (err) {
    console.log("err.message: ", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get all questions for a round id passed in
server.get("/questions/:id", utilities.protected, async (req, res) => {
  try {
    // Game Id passed in request URL
    const { id } = req.params;

    // Gets all rounds from the Rounds table where the game id matches the passed in ID
    let questions = await db
      // Choose which columns we want to select, and assign an alias
      .select(
        "q.id as questionId",
        "q.rounds_id as roundId",
        "q.category as category",
        "q.difficulty as difficulty",
        "q.type as type",
        "q.question as question",
        "q.correct_answer as correct_answer",
        "q.answers as answers",
        "incorrect_answers as incorrect_answers"
      )
      .from("Rounds as r")
      .leftJoin("Questions as q", "q.rounds_id", "r.id")
      .where("q.rounds_id", "=", id);

    console.log("questions: ", questions);
    if (questions) {
      questions = questions.map(question => {
        question.incorrect_answers = question.incorrect_answers.split("--");
        question.answers = question.answers.split("--");
        return question;
      });
    }
    res.status(200).json(questions);
  } catch (err) {
    console.log("err.message: ", err.message);
    res.status(500).json({ error: "Problem getting questions" });
  }
});
// Get User user info by user id
server.get("/users/:id", utilities.protected, async (req, res) => {
  try {
    // User Id passed in request URL
    const { id } = req.params;

    // Gets all info from the Users table where the user id matches the passed in ID
    let users = await db
      // Choose which columns we want to select, and assign an alias
      .select(
        "u.id as userId",
        "u.username as userName",
        "u.password as password",
        "u.name as name",
        "u.email as email",
        "u.phone as phone",
        "u.logo as logo",
        "u.credit_card as creditCard",
        "u.paid as paid"
      )
      .from("Users as u")
      .where("u.id", "=", id);

    //   console.log("questions: ", questions);

    res.status(200).json(users);
  } catch (err) {
    console.log("err.message: ", err.message);
    res.status(500).json({ error: "Problem getting user" });
  }
});

// Save all questions for a round ID
server.post("/questions", utilities.protected, async (req, res) => {
  try {
    console.log("req.body!!!: ", req.body);
    console.log("req.body[0].rounds_id!!!: ", req.body[0].rounds_id);
    // Check for valid Round Id
    let validRound = await db("Rounds").where({ id: req.body[0].rounds_id });

    console.log("validRound: ", validRound);
    if (validRound.length < 1) {
      throw new Error({ error: "Not a valid round ID" });
    }

    let successfulInsert = await db("Questions").insert(req.body);
    res.status(200).json({ successfulInsert });

    console.log("successfulInsert: ", successfulInsert);
  } catch (err) {
    console.log("err.message", err.message);
    console.log("err: ", err);
    res.status(500).json({ error: "Problem saving questions" });
  }
});

// Delete all questions for a round based on round ID
server.delete("/questions/:id", utilities.protected, async (req, res) => {
  const { id } = req.params;

  try {
    // Delete all rounds
    let responseQuestions = await db("Questions")
      .where({ rounds_id: id })
      .del();

    console.log("responseQuestions: ", responseQuestions);

    res.status(200).json(`Questions deleted`);
  } catch (err) {
    console.log("err.message: ", err.message);
    res.status(400).json({ error: err.message });
  }
});

server.delete("/game/:id", utilities.protected, async (req, res) => {
  const { id } = req.params;
  try {
    // Returns the id of the deleted game
    let response = await db("Games")
      .where({ id })
      .del();

    // If response === 0 no game was deleted
    if (response === 0) throw new Error(`Error deleting game ${id}`);

    console.log("id: ", id);

    res.status(200).json(`Game ${response} deleted`);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = server;
