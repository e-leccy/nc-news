const express = require("express");
const app = express();

const { getTopics } = require("./controllers/topics-controller");
const {
  getArticles,
  getArticleByID,
  getCommentsByArticleID,
  postComment,
  patchArticle,
} = require("./controllers/articles-controller");
const { deleteComment } = require("./controllers/comments-controller");

const {
  handleDefinedErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./errors");

const endpointsJson = require("../endpoints.json");

app.use(express.json());

app.get("/api", (request, response) => {
  response.status(200).send({ endpoints: endpointsJson });
});

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:articleID", getArticleByID);

app.get("/api/articles/:articleID/comments", getCommentsByArticleID);

app.post("/api/articles/:articleID/comments", postComment);

app.patch("/api/articles/:articleID", patchArticle);

app.delete("/api/comments/:commentID", deleteComment);

//error handling

app.use(handleDefinedErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
