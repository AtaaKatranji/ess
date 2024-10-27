const express = require('express');
const router = express.Router();
const shiftController = require('../controllers/shiftController');

// Create a new shift
router.post('/', shiftController.createShift);

// Get all shifts
router.get('/', shiftController.getAllShifts);

// Get a single shift by ID
router.get('/:id', shiftController.getShiftById);

// Update a shift by ID
router.put('/:id', shiftController.updateShift);

// Delete a shift by ID
router.delete('/:id', shiftController.deleteShift);

module.exports = router;
