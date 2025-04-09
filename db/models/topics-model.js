const db = require("../connection");
const { checkArgsValid } = require("../seeds/utils");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics").then((result) => {
    return result.rows;
  });
};

exports.insertTopic = (newTopic) => {
  const queryArgs = [newTopic.slug, newTopic.description];
  console.log(queryArgs, "args");
  return checkArgsValid(queryArgs).then(() => {
    let queryString = `INSERT INTO topics (slug, description)
VALUES ($1, $2)
RETURNING *`;

    return db.query(queryString, queryArgs).then((result) => {
      const topic = result.rows[0];
      return topic;
    });
  });
};
