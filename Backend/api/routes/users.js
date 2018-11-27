const server = require("express")(); // sets up an express instance and returns a callback function
const db = require("../../data/db");
const utilities = require("../util/utilities");

var simplecrypt = require("simplecrypt");

var sc = simplecrypt({ password: process.env.SECRET });

// Base endpoint (at users/)
server.get("/", (req, res) => {
    //   console.log(process.env);
    res.json("App is currently functioning");
});

// Testing endpoints
// Get all users table
server.get("/users", (req, res) => {
    db("Users")
        .then(response => {
            console.log(response);
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
            console.log(response);
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
            console.log(response);
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
            console.log(response);
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

    // Check to see if we have a username, password and email
    if (!username || !password || !email) {
        res.status(400).json({
            error:
                "Please include a valid User Name, password and email address"
        });
    }

    // Encrypt password and add to package to be stored in Users table
    const hash = sc.encrypt(password);
    const credentials = {
        username: username,
        password: hash,
        email: email,
        name: name,
        phone: phone,
        logo: logo
    };

    try {
        // Try to insert the user
        let userId = await db("Users").insert(credentials);

        if (!userId) throw new Error("Unable to add that user");

        // Generate a new token and return it
        let token = utilities.generateToken(username);
        res.status(201).json(token);
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
            res.status(201).json(token);
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
    const {
        username,
        description,
        gamename,
        dateCreated,
        datePlayed,
        rounds
    } = req.body;

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
                    name: round.roundname,
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
server.post(
    "/games",
    utilities.getUser,
    utilities.protected,
    async (req, res) => {
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
    }
);

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

        res.status(200).json(`Round ${response} deleted`);
    } catch (err) {
        res.status(400).json({ error: `Error deleting round ${id}` });
    }
});

// Save a round
server.post("/round", utilities.protected, async (req, res) => {
    try {
        // Get all pertinent info from req.body
        const {
            gameId,
            roundname,
            category,
            difficulty,
            type,
            questions
        } = req.body;

        // Returns empty array if no game
        let validGame = await db("Games").where({ id: gameId });

        // Check to see if valid gameId
        if (validGame.length < 1) throw new Error("no Game by that ID");

        // Assemble round info to be entered in DB
        let roundPackage = {
            game_id: gameId,
            name: roundname,
            category: category,
            type: type,
            difficulty: difficulty,
            number_of_questions: questions.length
        };

        // Returns an array of 1 item, pull that item out with [0]
        let roundId = (await db("Rounds").insert(roundPackage))[0];

        // Return new round ID
        res.status(200).json(roundId);
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
                name: edit.roundName,
                number_of_questions: edit.numberOfQs,
                category: edit.category,
                difficulty: edit.difficulty,
                type: edit.type
            });

        // get game by id
        let newRound = await db("Rounds").where("id", id);

        res.status(200).json({
            roundId: newRound[0]["id"],
            roundname: newRound[0]["name"],
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

// Delete Game

// users -> games -> rounds -> questions -> answers

module.exports = server;








































// Get all questions for a round id passed in
server.get("/questions/:id", utilities.protected, async (req, res) => {
    try {
        // Game Id passed in request URL
        const { id } = req.params;

        // Gets all rounds from the Rounds table where the game id matches the passed in ID
        let rounds = await db
            // Choose which columns we want to select, and assign an alias
            .select(
                "q.id as questionId",
                "q.category as category",
                "q.difficulty as difficulty",
                "q.type as type",
                "q.question as question",
                "q.correct_answer as correctAnswer",
                "incorrect_answers as incorrectAnswers"
            )
            .from("Rounds as r")
            .leftJoin("Questions as q", "q.rounds_id", "r.id")
            .where("r.id", "=", id);

        res.status(200).json(rounds);
    } catch (err) {
        res.status(500).json({ error: "Problem getting questions" });
    }
});