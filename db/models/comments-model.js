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
