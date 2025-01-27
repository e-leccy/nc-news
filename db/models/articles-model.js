const db = require("../connection");

exports.selectArticleByID = (articleID) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [articleID])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject(new Error("Article Not Found"));
      } else {
        return result.rows[0];
      }
    });
};
