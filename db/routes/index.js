const topicsController = require("../controllers/topics-controller");
const articlesController = require("../controllers/articles-controller");
const commentsController = require("../controllers/comments-controller");
const usersController = require("../controllers/users-controller");

const errorHandlers = require("../errors");

module.exports = {
  topicsController,
  articlesController,
  commentsController,
  usersController,
  errorHandlers,
};
