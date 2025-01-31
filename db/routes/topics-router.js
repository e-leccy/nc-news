const express = require("express");

const router = express.Router();

const topicsController = require("../controllers/topics-controller");

router.route("").get(topicsController.getTopics);

module.exports = router;
