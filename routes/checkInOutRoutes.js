const express = require('express');
const router = express.Router();
const checkInOutController = require('../controllers/checkInOutController');

// Define the routes
router.post('/startWork', checkInOutController.checkIn);
router.post('/stopWork', checkInOutController.checkOut);
router.post('/calculate-hours', checkInOutController.getTotalHours);
router.post('/calculate-lateHours', checkInOutController.getTotalLateHours);
router.put('/update', checkInOutController.update);
router.post('/getAllHistory', checkInOutController.getAllHistory);
router.post('/monthlyHistory', checkInOutController.getMonthlyHistory);
router.post('/lastmonthlyHistory', checkInOutController.getLastMonthlyHistory);
router.post('/checkcurrentday', checkInOutController.currentCheck);

module.exports = router;
