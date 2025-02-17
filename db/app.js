const express = require("express");
const app = express();
const endpointsJson = require("../endpoints.json");
const cors = require("cors");

const { errorHandlers } = require("../db/routes");

const articles = require("../db/routes/articles-router");
const topics = require("../db/routes/topics-router");
const users = require("../db/routes/users-router");
const comments = require("../db/routes/comments-router");

app.use(cors());

app.get("/api", (request, response) => {
  response.status(200).send({ endpoints: endpointsJson });
});

app.use("/api/articles", articles);

app.use("/api/topics", topics);

app.use("/api/users", users);

app.use("/api/comments", comments);

//error handling

app.use(errorHandlers.handleDefinedErrors);
app.use(errorHandlers.handleCustomErrors);
app.use(errorHandlers.handleServerErrors);

module.exports = app;
