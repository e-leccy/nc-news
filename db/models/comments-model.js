const db = require("../connection");

exports.removeComment = (commentID) => {
  const queries = [commentID];
  let queryString = `DELETE from comments
    WHERE comment_id = $1`;

  return db.query(queryString, queries).then((result) => {
    if (result.length === 0) {
      return;
    }
  });
};
