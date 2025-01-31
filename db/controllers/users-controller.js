const { selectUsers, selectUserByID } = require("../models/users-model");

exports.getUsers = (request, response, next) => {
  selectUsers()
    .then((users) => {
      response.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUserByID = (request, response, next) => {
  const username = request.params.username;
  selectUserByID(username)
    .then((user) => {
      response.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};
