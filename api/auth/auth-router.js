// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!
const router = require("express").Router();
const {
  checkUsernameFree,
  checkPasswordLength,
  checkUsernameExists,
} = require("./auth-middleware");
const Database = require("../users/users-model");
const bcrypt = require("bcryptjs");
const session = require("express-session");

// 1 [POST] /api/auth/register { "username": "sue", "password": "1234" }
router.post(
  "/register",
  checkUsernameFree,
  checkPasswordLength,
  async (req, res, next) => {
    const password = req.body.password;
    const hash = bcrypt.hashSync(password, 12);
    req.body.password = hash;

    await Database.add(req.body).then((result) => {
      const [id] = result;
      res.status(200).json({ user_id: id, username: req.body.username });
    });
  }
);

// 2 [POST] /api/auth/login { "username": "sue", "password": "1234" }
router.post(
  "/login",
  checkUsernameExists,
  checkPasswordLength,
  async (req, res, next) => {
    const username = req.body.username;
    await Database.findBy(username)
      .then((result) => {
        // If the username doesn't exist
        if (!req.usernameExists) {
          next({ status: 401, message: "invalid credentials" });
        }

        // Validate password
        const [{ password }] = result;
        if (!bcrypt.compareSync(req.body.password, password)) {
          console.log("INVALLIDE PASSWORD");
          next({ status: 401, message: "invalid credentials" });

          // Handle correct validation of username and password
        } else {
          console.log("CORRECT PASSWORD - VALIDATED");
          req.session.username = username;
          req.session.loggedIn = true;

          res.status(200).json({ message: `Welcome ${username}!` });
        }
      })
      .catch(next);
  }
);

// 3 [GET] /api/auth/logout
router.get("/logout", (req, res, next) => {
  if (req.session.loggedIn) {
    res.clearCookie('chocolatechip');
    console.log(req.session)
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      return res.status(200).json({ message: "logged out" });
  })}
  else {
    return res.status(200).json({ message: "no session" });
  }

});

// Don't forget to add the router to the `exports` object so it can be required in other modules

module.exports = router;
