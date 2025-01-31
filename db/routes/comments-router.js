const express = require("express");

const router = express.Router();

const commentsController = require("../controllers/comments-controller");

router.use(express.json());

router
  .route("/:commentID")
  .delete(commentsController.deleteComment)
  .patch(commentsController.patchComment);

module.exports = router;
