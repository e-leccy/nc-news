const express = require("express");

const router = express.Router();

const topicsController = require("../controllers/topics-controller");

router.use(express.json());

router
  .route("")
  .get(topicsController.getTopics)
  .post(topicsController.postTopic);

module.exports = router;
