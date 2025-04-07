const db = require("../connection");
const { checkArticleExists } = require("../seeds/utils");

exports.selectArticles = (queries) => {
  const sort_by = queries.sort_by;
  const order = queries.order;
  const topic = queries.topic;
  const limit = queries.limit;
  const p = queries.p;

  let queryString = `SELECT articles.article_id, articles.author, articles.title, 
  articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
  COUNT(comments.article_id) AS comment_count FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id`;

  if (topic) {
    queryString += ` WHERE articles.topic = '${topic}'`;
  }

  queryString += ` GROUP BY articles.article_id`;

  if (Object.keys(queries).length === 0) {
    queryString += ` ORDER BY created_at DESC`;
  }

  if (sort_by) {
    const greenList = [
      "author",
      "topic",
      "title",
      "created_at",
      "votes",
      "comment_count",
    ];
    if (greenList.includes(sort_by)) {
      queryString += ` ORDER BY ${sort_by}`;
    } else {
      return Promise.reject({ status: 404, message: "Invalid Input" });
    }

    if (order === undefined) {
      const order = "DESC";
      queryString += ` ${order}`;
    } else if (order === "desc" || order === "asc") {
      queryString += ` ${order}`;
    } else {
      return Promise.reject({ status: 400, message: "Invalid Input" });
    }
  }

  let queryStringWithPagination = `${queryString}`;

  if (limit) {
    queryStringWithPagination += ` LIMIT ${limit}`;
  }

  if (p) {
    const offset = (p - 1) * limit;
    queryStringWithPagination += ` OFFSET ${offset}`;
  }

  return db
    .query(queryStringWithPagination)
    .then((result) => {
      const articles = result.rows;
      if (articles.length === 0) {
        return Promise.reject({ status: 404, message: "No Articles Found" });
      }
      return articles;
    })
    .then((articles) => {
      return db.query(queryString).then((result) => {
        const total_count = result.rows.length;
        return { articles, total_count };
      });
    });
};

exports.selectArticleByID = (articleID) => {
  return checkArticleExists(articleID)
    .then(() => {
      return db.query(
        `SELECT articles.article_id, articles.body, articles.author, articles.title, 
  articles.topic, articles.created_at, articles.votes, articles.article_img_url,
  COUNT(comments.article_id)::INT AS comment_count FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id
  WHERE articles.article_id = $1
  GROUP BY articles.article_id`,
        [articleID]
      );
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
  return checkArticleExists(articleID).then(() => {
    const queryArgs = [increaseVotes, articleID];
    let queryString = `UPDATE articles
  SET votes = votes + $1
  WHERE article_id = $2
  RETURNING *`;

    return db.query(queryString, queryArgs).then((result) => {
      const article = result.rows[0];
      return article;
    });
  });
};

exports.insertArticle = (newArticle) => {
  const queryArgs = [
    newArticle.title,
    newArticle.topic,
    newArticle.author,
    newArticle.body,
  ];

  let queryString = `INSERT INTO articles (title, topic, author, body)
  VALUES ($1, $2, $3, $4)
  RETURNING *`;
  return db.query(queryString, queryArgs).then((result) => {
    let queryString = `SELECT articles.article_id, articles.body, articles.author, articles.title, 
    articles.topic, articles.created_at, articles.votes, articles.article_img_url,
    COUNT(comments.article_id)::INT AS comment_count FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id`;
    const newArticleID = result.rows[0].article_id;
    const queryArgs = [newArticleID];

    return db.query(queryString, queryArgs).then((result) => {
      const article = result.rows[0];
      console.log(result.rows);
      return article;
    });
  });
};
