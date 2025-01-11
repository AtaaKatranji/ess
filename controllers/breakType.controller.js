const BreakType = require('../models/breakType');

// Create a new break type
exports.createBreakType = async (req, res) => {
  try {
    const { name, duration, shiftId } = req.body;
    const newBreakType = new BreakType({ name, duration, shiftId });
    await newBreakType.save();
    res.status(201).json({ message: 'Break type created successfully', data: newBreakType });
  } catch (error) {
    res.status(400).json({ message: 'Error creating break type', error: error.message });
  }
};

// Get all break types
exports.getAllBreakTypes = async (req, res) => {
  try {
    const breakTypes = await BreakType.find().populate('shiftId');
    res.status(200).json({ message: 'Break types fetched successfully', data: breakTypes });
  } catch (error) {
    res.status(400).json({ message: 'Error fetching break types', error: error.message });
  }
};

// Get a single break type by ID
exports.getBreakTypeById = async (req, res) => {
  try {
    const breakType = await BreakType.findById(req.params.id).populate('shiftId');
    if (!breakType) {
      return res.status(404).json({ message: 'Break type not found' });
    }
    res.status(200).json({ message: 'Break type fetched successfully', data: breakType });
  } catch (error) {
    res.status(400).json({ message: 'Error fetching break type', error: error.message });
  }
};

// Update a break type
exports.updateBreakType = async (req, res) => {
  try {
    const { name, duration, shiftId } = req.body;
    const breakType = await BreakType.findByIdAndUpdate(
      req.params.id,
      { name, duration, shiftId },
      { new: true }
    );
    if (!breakType) {
      return res.status(404).json({ message: 'Break type not found' });
    }
    res.status(200).json({ message: 'Break type updated successfully', data: breakType });
  } catch (error) {
    res.status(400).json({ message: 'Error updating break type', error: error.message });
  }
};

// Delete a break type
exports.deleteBreakType = async (req, res) => {
  try {
    const breakType = await BreakType.findByIdAndDelete(req.params.id);
    if (!breakType) {
      return res.status(404).json({ message: 'Break type not found' });
    }
    res.status(200).json({ message: 'Break type deleted successfully', data: breakType });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting break type', error: error.message });
  }
};
// Get all break types for a specific shift ID
exports.getBreakTypesByShiftId = async (req, res) => {
    try {
      const shiftId = req.params.shiftId;
      const breakTypes = await BreakType.find({ shiftId }).populate('shiftId');
      if (breakTypes.length === 0) {
        return res.status(404).json({ message: 'No break types found for this shift' });
      }
      res.status(200).json({ message: 'Break types fetched successfully', data: breakTypes });
    } catch (error) {
      res.status(400).json({ message: 'Error fetching break types', error: error.message });
    }
  };