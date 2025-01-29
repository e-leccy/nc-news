const express = require("express");
const app = express();

const { getTopics } = require("./controllers/topics-controller");
const {
  getArticles,
  getArticleByID,
  getCommentsByArticleID,
} = require("./controllers/articles-controller");

const {
  handleDefinedErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./errors");

const endpointsJson = require("../endpoints.json");

app.get("/api", (request, response) => {
  response.status(200).send({ endpoints: endpointsJson });
});

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:articleID", getArticleByID);

app.get("/api/articles/:articleID/comments", getCommentsByArticleID);

//error handling

app.use(handleDefinedErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
