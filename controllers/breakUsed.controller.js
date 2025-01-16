const BreakUsed = require('../models/breakUesd');

// Create a new BreakUsed entry
exports.createBreakUsed = async (req, res) => {
  try {
    const { breakId, isUsed, employeeId } = req.body;

    // Check if the breakId already exists for the employee
    const existingBreakUsed = await BreakUsed.findOne({ breakId, employeeId });
    if (existingBreakUsed) {
      return res.status(400).json({ message: 'Break already used by this employee.' });
    }

    const newBreakUsed = new BreakUsed({
      breakId,
      isUsed,
      employeeId,
    });

    await newBreakUsed.save();
    res.status(201).json({ message: 'BreakUsed created successfully!', data: newBreakUsed });
  } catch (error) {
    res.status(500).json({ message: 'Error creating BreakUsed', error: error.message });
  }
};

// Get all BreakUsed entries for an employee
exports.getBreaksUsedByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const breaksUsed = await BreakUsed.find({ employeeId });
    res.status(200).json({ data: breaksUsed });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching BreakUsed entries', error: error.message });
  }
};

// Update a BreakUsed entry
exports.updateBreakUsed = async (req, res) => {
  try {
    const { id } = req.params;
    const { isUsed } = req.body;

    const updatedBreakUsed = await BreakUsed.findByIdAndUpdate(
      id,
      { isUsed, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedBreakUsed) {
      return res.status(404).json({ message: 'BreakUsed not found.' });
    }

    res.status(200).json({ message: 'BreakUsed updated successfully!', data: updatedBreakUsed });
  } catch (error) {
    res.status(500).json({ message: 'Error updating BreakUsed', error: error.message });
  }
};

// Delete a BreakUsed entry
exports.deleteBreakUsed = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBreakUsed = await BreakUsed.findByIdAndDelete(id);

    if (!deletedBreakUsed) {
      return res.status(404).json({ message: 'BreakUsed not found.' });
    }

    res.status(200).json({ message: 'BreakUsed deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting BreakUsed', error: error.message });
  }
};