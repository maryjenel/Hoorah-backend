const express = require('express');
const router = express.Router();

const feedController = require('../controllers/Feed');

router.post('/postfeeditem', feedController.postFeedItem);
router.get('/getfeed', feedController.getFeed);

module.exports = router;