const { selectTopics, insertTopic } = require("../models/topics-model");

exports.getTopics = (request, response, next) => {
  selectTopics()
    .then((topics) => {
      response.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postTopic = (request, response, next) => {
  const newTopic = request.body;
  insertTopic(newTopic)
    .then((topic) => {
      response.status(201).send({ topic });
    })
    .catch((err) => {
      next(err);
    });
};
