const express = require('express');
const router = express.Router();

const authController = require('../controllers/Auth.js');

router.post('/getAccessToken', authController.getAccessToken);

module.exports = router;