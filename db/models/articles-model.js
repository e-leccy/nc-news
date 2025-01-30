const db = require("../connection");
const { checkArticleExists } = require("../seeds/utils");

exports.selectArticles = (queries) => {
  const sort_by = queries.sort_by;
  const order = queries.order;

  let queryString = `SELECT articles.article_id, articles.author, articles.title, 
  articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
  COUNT(comments.article_id) AS comment_count FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id
  GROUP BY
  articles.article_id`;
  if (Object.keys(queries).length === 0) {
    queryString += ` ORDER BY created_at DESC`;
  }

  if (sort_by) {
    const greenList = ["author", "topic"];
    if (greenList.includes(sort_by)) {
      queryString += ` ORDER BY ${sort_by}`;
    } else {
      return Promise.reject({ status: 404, message: "Invalid Input" });
    }

    if (order === undefined) {
      const order = "DESC";
      queryString += ` ${order}`;
    } else {
      const order = "ASC";
      queryString += ` ${order}`;
    }
  }
  console.log("query", queryString);
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
  const queryArgs = [articleID];
  let queryString = `SELECT comments.article_id, comments.votes,
  comments.created_at, comments.author, comments.body, comments.comment_id
  FROM comments
  WHERE article_id = $1
  ORDER BY created_at DESC`;
  return checkArticleExists(articleID)
    .then(() => {
      return db.query(queryString, queryArgs);
    })
    .then((result) => {
      const comments = result.rows;
      return comments;
    });
};

exports.insertComment = (newComment, articleID) => {
  const queryArgs = [newComment.body, articleID, newComment.username];
  let queryString = `INSERT INTO comments (body, article_id, author)
  VALUES ($1, $2, $3)
  RETURNING *`;

  return db.query(queryString, queryArgs).then((result) => {
    const comment = result.rows[0];
    return comment;
  });
};

exports.updateArticle = (increaseVotes, articleID) => {
  const queryArgs = [increaseVotes, articleID];
  let queryString = `UPDATE articles
  SET votes = votes + $1
  WHERE article_id = $2
  RETURNING *`;

  return db.query(queryString, queryArgs).then((result) => {
    const article = result.rows[0];
    return article;
  });
};
