// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!
const router = require("express").Router();
const {
  checkUsernameFree,
  checkPasswordLength,
  checkUsernameExists,
} = require("./auth-middleware");
const knex = require("../../data/db-config");
const Database = knex();

// 1 [POST] /api/auth/register { "username": "sue", "password": "1234" }
router.post(
  "/register",
  checkUsernameFree,
  checkPasswordLength,
  (req, res, next) => {
    res.status(200).json("POST AUTH REGISTER")
  })
// response:
// status 200
// {
//   "user_id": 2,
//   "username": "sue"
// }

// response on username taken:
// status 422
// {
//   "message": "Username taken"
// }

// response on password three chars or less:
// status 422
// {
//   "message": "Password must be longer than 3 chars"
// }


  // 2 [POST] /api/auth/login { "username": "sue", "password": "1234" }
  router.post(
  "/login",
  checkUsernameFree,
  checkPasswordLength,
  (req, res, next) => {
    res.status(200).json("POST AUTH LOGIN")
  })
  // response:
  // status 200
  // {
  //   "message": "Welcome sue!"
  // }

  // response on invalid credentials:
  // status 401
  // {
  //   "message": "Invalid credentials"
  // }


  // 3 [GET] /api/auth/logout
  router.get(
    "/",
    checkUsernameFree,
    checkPasswordLength,
    (req, res, next) => {
      res.status(200).json("GET AUTH")
    })
  // response for logged-in users:
  // status 200
  // {
  //   "message": "logged out"
  // }

  // response for not-logged-in users:
  // status 200
  // {
  //   "message": "no session"
  // }


// Don't forget to add the router to the `exports` object so it can be required in other modules

module.exports = router;
