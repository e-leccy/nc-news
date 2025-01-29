const db = require("../connection");

exports.selectUsers = () => {
  let queryString = `SELECT * FROM users`;

  return db.query(queryString).then((result) => {
    const users = result.rows;
    return users;
  });
};
