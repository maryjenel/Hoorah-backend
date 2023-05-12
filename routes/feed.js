const express = require('express');
const router = express.Router();

const feedController = require('../controllers/Feed');
router.post('/postfeeditem', feedController.postFeedItem);
module.exports = router;