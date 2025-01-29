const {
  selectArticles,
  selectArticleByID,
  selectComments,
  insertComment,
} = require("../models/articles-model");

exports.getArticles = (request, response, next) => {
  selectArticles()
    .then((articles) => {
      response.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleByID = (request, response, next) => {
  const articleID = request.params.articleID;
  selectArticleByID(articleID)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticleID = (request, response, next) => {
  const articleID = request.params.articleID;
  selectComments(articleID)
    .then((comments) => {
      response.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (request, response, next) => {
  const newComment = request.body;
  const articleID = request.params.articleID;
  insertComment(newComment, articleID)
    .then((comment) => {
      response.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
