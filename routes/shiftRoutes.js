const express = require('express');
const router = express.Router();
const shiftController = require('../controllers/shiftController');

// Create a new shift
router.post('/', shiftController.createShift);

// Get all shifts
router.get('/', shiftController.getAllShifts);

// Get all Institution's shifts
router.post('/Ins', shiftController.getInstitutionShifts);
// Get a single shift by ID
router.get('/:id', shiftController.getShiftById);

// Update a shift by ID
router.put('/:id', shiftController.updateShift);

router.put('/:id/assign', shiftController.assignEmployee);
router.post('/:shiftId/remove', shiftController.removeEmployeeFromShift);
router.post('/:fromShiftId/move', shiftController.moveEmployee);

// Delete a shift by ID
router.delete('/:id', shiftController.deleteShift);

module.exports = router;
