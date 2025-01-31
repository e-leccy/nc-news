const express = require("express");
const app = express();
const endpointsJson = require("../endpoints.json");

const {
  topicsController,
  articlesController,
  commentsController,
  usersController,
  errorHandlers,
} = require("../db/routes");

const articles = require("../db/routes/articles-router");

app.use("/api/articles", articles);

app.use(express.json());

app.get("/api", (request, response) => {
  response.status(200).send({ endpoints: endpointsJson });
});

app.get("/api/topics", topicsController.getTopics);

app.get("/api/users", usersController.getUsers);

app.delete("/api/comments/:commentID", commentsController.deleteComment);

//error handling

app.use(errorHandlers.handleDefinedErrors);
app.use(errorHandlers.handleCustomErrors);
app.use(errorHandlers.handleServerErrors);

module.exports = app;
