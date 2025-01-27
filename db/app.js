const express = require("express");
const endpointsJson = require("../endpoints.json");
console.log(endpointsJson);

const app = express();

app.get("/api", (request, response) => {
  response.status(200).send({ endpoints: endpointsJson });
});

module.exports = app;
