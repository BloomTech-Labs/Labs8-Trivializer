const jwt = require("jsonwebtoken");
const db = require("../../data/db");

let secret = process.env.SECRET; // Gets the secret stored in the .env file

module.exports = {
  // Gets a user from the DB and assigns that user to req.userIn
  getUser: function(req, res, next) {
    let { username } = req.body;
    try {
      db("Users")
        .where({ username })
        .first()
        .then(user => {
          if (user) {
            req.userIn = user;
            next();
          } else {
            res
              .status(500)
              .json({ error: "Error with user name or password1" });
          }
        });
    } catch (err) {
      res.status(500).json({ error: "Error with user name or password" });
    }
  },

  // Generates a new users, or a logged in users token
  generateToken: function(username) {
    const payload = {
      username: username
    };

    const options = {
      expiresIn: "1h",
      jwtid: "12345"
    };

    return jwt.sign(payload, secret, options);
  },

  // Validates a users JWT token
  protected: function(req, res, next) {
    const token = req.headers.authorization;

    if (token) {
      jwt.verify(token, secret, (err, decodedToken) => {
        if (err) {
          console.log("Token Invalid!!");
          return res
            .status(401)
            .json({ error: "you shall not pass!! - token invalid" });
        }

        req.jwtToken = decodedToken;
        next();
      });
    } else {
      console.log("No Token!!");
      return res.status(401).json({ error: "you shall not pass!! - no token" });
    }
  }
};
