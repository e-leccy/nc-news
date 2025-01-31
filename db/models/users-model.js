const db = require("../connection");
const { checkUserExists } = require("../seeds/utils");

exports.selectUsers = () => {
  let queryString = `SELECT * FROM users`;

  return db.query(queryString).then((result) => {
    const users = result.rows;
    return users;
  });
};

exports.selectUserByID = (username) => {
  return checkUserExists(username)
    .then(() => {
      return db.query(
        `SELECT * FROM users
  WHERE username = $1`,
        [username]
      );
    })
    .then((result) => {
      return result.rows[0];
    });
};
