exports.handleDefinedErrors = (err, request, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ error: "Invalid Endpoint" });
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (err, request, response, next) => {
  if (err) {
    response.status(404).send({ error: "Endpoint Not Found" });
  } else {
    next(err);
  }
};

exports.handleServerErrors = (err, request, response, next) => {
  console.log(err);
  response.status(500).send({ error: "Internal Server Error" });
};
