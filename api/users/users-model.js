/**
  resolves to an ARRAY with all users, each user having { user_id, username }
 */
function find() {
  next();
}

/**
  resolves to an ARRAY with all users that match the filter condition
 */
function findBy(filter) {
  next();
}

/**
  resolves to the user { user_id, username } with the given user_id
 */
function findById(user_id) {
  next();
}

/**
  resolves to the newly inserted user { user_id, username }
 */
function add(user) {
  next();
}

// Don't forget to add these to the `exports` object so they can be required in other modules

module.exports = {
  add,
  find,
  findBy,
  findById
}