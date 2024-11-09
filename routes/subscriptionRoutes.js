const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');

router.post('/save-subscription', subscriptionController.saveSubscription);

module.exports = router;