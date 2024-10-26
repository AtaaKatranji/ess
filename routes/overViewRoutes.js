const express = require('express');
const router = express.Router();
const overViewController = require('../controllers/overViewController');

// Define the routes
router.get('/getOverView', overViewController.getOverView);


module.exports = router;
