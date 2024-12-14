// leaveRoutes.js
const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaves.controller'); // Adjust the path as necessary

// Create a new leave request
router.post('/', leaveController.createLeave);

// Get all leave requests
router.get('/', leaveController.getAllLeaves);

// Get a specific leave request by ID
router.get('/:id', leaveController.getLeaveById);

// Update a leave request
router.put('/:id', leaveController.updateLeave);

// Delete a leave request
router.delete('/:id', leaveController.deleteLeave);



router.patch('/:id/approve', leaveController.approveLeaveRequest);
router.patch('/:id/reject', leaveController.rejectLeaveRequest);


router.post('/month', leaveController.getEmployeeMonthLeaves);
module.exports = router;