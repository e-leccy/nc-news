const db = require("../connection");

exports.selectArticleByID = (articleID) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [articleID])
    .then((result) => {
      console.log(result.rows);
      return result.rows[0];
    });
};
