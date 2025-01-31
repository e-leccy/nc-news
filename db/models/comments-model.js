const db = require("../connection");
const { checkCommentExists } = require("../seeds/utils");

exports.removeComment = (commentID) => {
  return checkCommentExists(commentID).then(() => {
    const queries = [commentID];
    let queryString = `DELETE from comments
    WHERE comment_id = $1`;

    return db.query(queryString, queries).then((result) => {
      if (result.length === 0) {
        return;
      }
    });
  });
};

exports.updateComment = (increaseVotes, commentID) => {
  return checkCommentExists(commentID).then(() => {
    const queryArgs = [increaseVotes, commentID];
    let queryString = `Update comments
    SET votes = votes + $1
    WHERE comment_id = $2
    RETURNING *`;

    return db.query(queryString, queryArgs).then((result) => {
      const comment = result.rows[0];
      return comment;
    });
  });
};
