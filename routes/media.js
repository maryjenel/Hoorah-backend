const express = require('express');
const router = express.Router();

const mediaController = require('../controllers/Media');

router.post('/postMediaToS3', mediaController.postMediaToS3);

module.exports = router;