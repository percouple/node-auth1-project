const Database = require("../users/users-model");

/* If the user does not have a session saved in the server,
  status 401, {"message": "You shall not pass!"}*/

function restricted(req, res, next) {
  console.log("RESTRICTED");
  if (req.session.loggedIn) {
    console.log("YES IM LOGGEDING")
    next();
  } else {
    next({ status: 401, message: "You shall not pass!" });
  }
}

/* If the username in req.body already exists in the database,
  status 422, {"message": "Username taken"}
*/
async function checkUsernameFree(req, res, next) {
  console.log("CHECK USERNAME FREE");
  console.log(req.body.username)
  await Database.findBy(req.body.username)
    .then((result) => {
      console.log(result)
      if (result.length) {
        throw Error;
      }
      next();
    })
    .catch((err) => {
      console.log("USERNAME NOT FREE");
      next({ status: 422, message: "Username taken" });
    });
}

async function checkUsernameExists(req, res, next) {
  console.log("CHECK USERNAME EXISTS");
  const username = req.body.username;
  await Database.findBy(username)
    .then((result) => {
      if (result.length) {
        console.log("USERNAME DOES EXIST")
        req.usernameExists = true;
      } else {
        console.log("USERNAME DOES NOT EXIST")
        req.usernameExists = false;
      }
      next();
    })
}

/* If password is missing from req.body, or if it's 3 chars or shorter,
  status 422, {"message": "Password must be longer than 3 chars"}
*/
function checkPasswordLength(req, res, next) {
  const password = req.body.password;
  if (!password || password.length < 4) {
    next({ status: 422, message: "Password must be longer than 3 chars" });
    return;
  }
  next();
}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
  checkPasswordLength,
  checkUsernameExists,
  checkUsernameFree,
  restricted,
};
