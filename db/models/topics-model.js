const db = require("../connection");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics").then((result) => {
    return result.rows;
  });
};

exports.insertTopic = (newTopic) => {
  const queryArgs = [newTopic.slug, newTopic.description];
  let queryString = `INSERT INTO topics (slug, description)
VALUES ($1, $2)
RETURNING *`;

  return db.query(queryString, queryArgs).then((result) => {
    const topic = result.rows[0];
    return topic;
  });
};
