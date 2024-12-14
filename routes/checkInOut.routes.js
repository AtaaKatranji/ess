const express = require('express');
const router = express.Router();
const checkInOutController = require('../controllers/checkInOut.controller');

// Define the routes
router.post('/startWork', checkInOutController.checkIn);
router.post('/add', checkInOutController.add);
router.get('/checks', checkInOutController.checkDate);
router.post('/stopWork', checkInOutController.checkOut);
router.post('/calculate-hours', checkInOutController.getTotalHours);
router.post('/calculate-lateHours', checkInOutController.getTotalLateHours);
router.put('/update', checkInOutController.update);
router.post('/getAllHistory', checkInOutController.getAllHistory);
router.post('/monthlyHistory', checkInOutController.getMonthlyHistory);
router.post('/monthlyHistoryFront', checkInOutController.getMonthlyHistoryMonth);
router.post('/lastmonthlyHistory', checkInOutController.getLastMonthlyHistory);
router.post('/checkcurrentday', checkInOutController.currentCheck);
router.post('/timeShift', checkInOutController.timeShift);
//router.post('/summry', checkInOutController.summry);
router.post('/summry2', checkInOutController.summry2);
router.get('/summaryLastTwoMonth/:employeeId', checkInOutController.summryLastTwoMonth);
router.get('/absences', checkInOutController.getAbsentDays);


module.exports = router;
