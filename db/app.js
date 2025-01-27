const express = require("express");
const app = express();

const { getTopics } = require("./controllers/topics-controller");

const { handleServerErrors } = require("./errors");

const endpointsJson = require("../endpoints.json");

app.get("/api", (request, response) => {
  response.status(200).send({ endpoints: endpointsJson });
});

app.get("/api/topics", getTopics);

//error handling

app.use(handleServerErrors);

module.exports = app;
