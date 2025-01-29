exports.handleDefinedErrors = (err, request, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ error: "Invalid Article ID" });
  } else if (err.code === "23502") {
    response.status(400).send({ error: "Missing Key" });
  } else if (err.code === "23503") {
    response.status(400).send({ error: "Invalid Input" });
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (err, request, response, next) => {
  if (err.status && err.message) {
    response.status(err.status).send({ error: err.message });
  } else {
    next(err);
  }
};

exports.handleServerErrors = (err, request, response, next) => {
  console.log(err);
  response.status(500).send({ error: "Internal Server Error" });
};
