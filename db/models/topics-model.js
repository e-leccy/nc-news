const db = require("../connection");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics").then((result) => {
    console.log(result.rows);
  });
};
