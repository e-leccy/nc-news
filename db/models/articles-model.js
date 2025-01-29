const db = require("../connection");
const { checkArticleExists } = require("../seeds/utils");

exports.selectArticles = () => {
  let queryString = `SELECT articles.article_id, articles.author, articles.title, 
  articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
  COUNT(comments.article_id) AS comment_count FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id
  GROUP BY
  articles.article_id ORDER BY created_at DESC`;
  return db.query(queryString).then((result) => {
    const articles = result.rows;
    return articles;
  });
};

exports.selectArticleByID = (articleID) => {
  return checkArticleExists(articleID)
    .then(() => {
      return db.query("SELECT * FROM articles WHERE article_id = $1", [
        articleID,
      ]);
    })
    .then((result) => {
      return result.rows[0];
    });
};

exports.selectComments = (articleID) => {
  queries = [articleID];
  let queryString = `SELECT comments.article_id, comments.votes,
  comments.created_at, comments.author, comments.body, comments.comment_id
  FROM comments
  WHERE article_id = $1
  ORDER BY created_at DESC`;
  return checkArticleExists(articleID)
    .then(() => {
      return db.query(queryString, queries);
    })
    .then((result) => {
      const comments = result.rows;
      return comments;
    });
};
