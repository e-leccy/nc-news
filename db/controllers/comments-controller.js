const { removeComment } = require("../models/comments-model");

exports.deleteComment = (request, response, next) => {
  const commentID = request.params.commentID;
  removeComment(commentID)
    .then(() => {
      response.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
