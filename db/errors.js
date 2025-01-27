exports.handleCustomErrors = (err, request, response, next) => {
  response.status(404).send({ error: "Endpoint Not Found" });
};

exports.handleServerErrors = (err, request, response, next) => {
  console.log(err);
  response.status(500).send({ error: "Internal Server Error" });
};
