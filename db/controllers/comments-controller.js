const { removeComment, updateComment } = require("../models/comments-model");

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

exports.patchComment = (request, response, next) => {
  const increaseVotes = request.body.inc_votes;
  const commentID = request.params.commentID;
  updateComment(increaseVotes, commentID)
    .then((updatedComment) => {
      response.status(200).send({ updatedComment });
    })
    .catch((err) => {
      next(err);
    });
};
