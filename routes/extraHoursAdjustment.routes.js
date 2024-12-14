// Route: extraHoursAdjustment.routes.js
const express = require('express');
const router = express.Router();
const {
  createExtraHoursAdjustment,
  getAllExtraHoursAdjustments,
  getExtraHoursAdjustmentById,
  deleteExtraHoursAdjustment,
} = require('../controllers/extraHoursAdjustment.controller');

router.post('/', createExtraHoursAdjustment);
router.get('/', getAllExtraHoursAdjustments);
router.get('/:id', getExtraHoursAdjustmentById);
router.delete('/:id', deleteExtraHoursAdjustment);

module.exports = router;