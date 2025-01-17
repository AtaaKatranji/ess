const express = require('express');
const router = express.Router();
const breakTypeController = require('../controllers/breakType.controller');
const employeeBreakController = require('../controllers/employeeBreak.controller');
const breakUsedController = require('../controllers/breakUsed.controller');

// BreakType Routes
router.post('/break-types', breakTypeController.createBreakType);
router.get('/break-types', breakTypeController.getAllBreakTypes);
router.get('/break-types/:id', breakTypeController.getBreakTypeById);
router.get('/break-types/shift/:shiftId', breakTypeController.getBreakTypesByShiftId); 
router.get('/break-types/employee/:employeeId', breakTypeController.getBreakTypesByEmployeeId); 
router.put('/break-types/:id', breakTypeController.updateBreakType);
router.delete('/break-types/:id', breakTypeController.deleteBreakType);

// EmployeeBreak Routes
router.post('/employee-breaks', employeeBreakController.createEmployeeBreak);
router.post('/employee-breaks/request-custom-break', employeeBreakController.requestCustomBreak);
router.get('/employee-breaks', employeeBreakController.getAllEmployeeBreaks);
router.get('/employee-breaks/:id', employeeBreakController.getEmployeeBreakById);
router.put('/employee-breaks/:id', employeeBreakController.updateEmployeeBreak);
router.delete('/employee-breaks/:id', employeeBreakController.deleteEmployeeBreak);

router.get('/employee-breaks/get-break-status/:breakId', employeeBreakController.getBreakStatus); //get break status
router.put('/employee-breaks/:breakId/status', employeeBreakController.updateBreakStatus); // Approve/reject break
router.put('/employee-breaks/:breakId/track', employeeBreakController.trackBreakTime); // Track break time

// BreakUsed Routes
router.post('/break-used', breakUsedController.createBreakUsed);
router.get('/break-used/employee/:employeeId', breakUsedController.getBreaksUsedByEmployee);
router.put('/break-used/:id', breakUsedController.updateBreakUsed);
router.delete('/break-used/:id', breakUsedController.deleteBreakUsed);

module.exports = router;