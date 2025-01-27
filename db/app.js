const express = require("express");
const app = express();

const { getTopics } = require("./controllers/topics-controller");
const endpointsJson = require("../endpoints.json");

app.get("/api", (request, response) => {
  response.status(200).send({ endpoints: endpointsJson });
});

app.get("/api/topics", getTopics);

module.exports = app;
