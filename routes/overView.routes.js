const express = require('express');
const router = express.Router();
const overViewController = require('../controllers/overView.controller');

// Define the routes
router.get('/overView', overViewController.getOverView);


module.exports = router;
