const express = require("express");

const router = express.Router();

const usersController = require("../controllers/users-controller");

router.route("").get(usersController.getUsers);

router.route("/:username").get(usersController.getUserByID);

module.exports = router;
