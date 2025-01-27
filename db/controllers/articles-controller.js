const { selectArticleByID } = require("../models/articles-model");

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
