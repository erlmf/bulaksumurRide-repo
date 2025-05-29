const express = require('express');
const router = express.Router();
const mongoController = require('../controllers/mongoController');

router.get('/test-mongo', mongoController.testMongoConnection);

module.exports = router;
