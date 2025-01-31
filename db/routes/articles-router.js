const express = require("express");

const router = express.Router();

const articlesController = require("../controllers/articles-controller");

router.use(express.json());

router.route("").get(articlesController.getArticles);

router
  .route("/:articleID")
  .get(articlesController.getArticleByID)
  .patch(articlesController.patchArticle);

router
  .route("/:articleID/comments")
  .get(articlesController.getCommentsByArticleID)
  .post(articlesController.postComment);

module.exports = router;
