const express = require('express');
const breakTimeController = require('../controllers/breakTime.controller');
const router = express.Router();

// Routes for BreakTime
router.post('/start', breakTimeController.startBreak);
router.put('/end', breakTimeController.endBreak);
router.get('/employee/:employeeId', breakTimeController.getBreaksByEmployee);
router.delete('/:breakId', breakTimeController.deleteBreak);
router.get('/employee/:employeeId/total-duration', breakTimeController.getTotalBreakDuration);

module.exports = router;
