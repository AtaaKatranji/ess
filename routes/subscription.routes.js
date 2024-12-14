const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscription.controller');

router.post('/save-subscription', subscriptionController.saveSubscription);

module.exports = router;