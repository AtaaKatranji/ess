
// Controller: extraHoursAdjustment.controller.js
const ExtraHoursAdjustment = require('../models/extraHoursAdjustment.model');

// Create a new adjustment
exports.createExtraHoursAdjustment = async (req, res) => {
  try {
    const adjustment = new ExtraHoursAdjustment(req.body);
    await adjustment.save();
    res.status(201).json(adjustment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all adjustments
exports.getAllExtraHoursAdjustments = async (req, res) => {
  try {
    const adjustments = await ExtraHoursAdjustment.find();
    res.status(200).json(adjustments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get adjustment by ID
exports.getExtraHoursAdjustmentById = async (req, res) => {
  try {
    const adjustment = await ExtraHoursAdjustment.findById(req.params.id);
    if (!adjustment) {
      return res.status(404).json({ error: 'Adjustment not found' });
    }
    res.status(200).json(adjustment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete adjustment by ID
exports.deleteExtraHoursAdjustment = async (req, res) => {
  try {
    const adjustment = await ExtraHoursAdjustment.findByIdAndDelete(req.params.id);
    if (!adjustment) {
      return res.status(404).json({ error: 'Adjustment not found' });
    }
    res.status(200).json({ message: 'Adjustment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
