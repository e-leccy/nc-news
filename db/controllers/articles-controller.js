const {
  selectArticles,
  selectArticleByID,
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
