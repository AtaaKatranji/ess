const BreakTime = require('../models/breakTime'); // Import the BreakTime model

// Controller for BreakTime Model
const breakTimeController = {
  // 1. Start a Break
  async startBreak(req, res) {
    try {
      const { employeeId, checkInId, breakStart, breakType } = req.body;

      // Create a new break record
      const breakTime = await BreakTime.create({
        employeeId,
        checkInId,
        breakStart: breakStart || new Date(),
        breakType: breakType || 'Other',
      });

      res.status(201).json({
        message: 'Break started successfully',
        data: breakTime,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error starting break', error: error.message });
    }
  },

  // 2. End a Break
  async endBreak(req, res) {
    try {
      const { breakId, breakEnd } = req.body;

      // Update the break with the end time
      const breakTime = await BreakTime.findByIdAndUpdate(
        breakId,
        { breakEnd: breakEnd || new Date(), updatedAt: new Date() },
        { new: true } // Return the updated document
      );

      if (!breakTime) {
        return res.status(404).json({ message: 'Break not found' });
      }

      res.status(200).json({
        message: 'Break ended successfully',
        data: breakTime,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error ending break', error: error.message });
    }
  },

  // 3. Get All Breaks for an Employee
  async getBreaksByEmployee(req, res) {
    try {
      const { employeeId } = req.params;

      const breaks = await BreakTime.find({ employeeId }).populate('checkInId', 'checkInTime checkOutTime');

      res.status(200).json({
        message: 'Breaks retrieved successfully',
        data: breaks,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving breaks', error: error.message });
    }
  },

  // 4. Delete a Break Record
  async deleteBreak(req, res) {
    try {
      const { breakId } = req.params;

      const breakTime = await BreakTime.findByIdAndDelete(breakId);

      if (!breakTime) {
        return res.status(404).json({ message: 'Break not found' });
      }

      res.status(200).json({
        message: 'Break deleted successfully',
        data: breakTime,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting break', error: error.message });
    }
  },

  // 5. Get Total Break Duration for an Employee
  async getTotalBreakDuration(req, res) {
    try {
      const { employeeId } = req.params;

      const totalDuration = await BreakTime.aggregate([
        { $match: { employeeId: employeeId } },
        {
          $group: {
            _id: null,
            totalDuration: { $sum: '$breakDuration' }, // Sum all break durations
          },
        },
      ]);

      res.status(200).json({
        message: 'Total break duration calculated successfully',
        totalDuration: totalDuration[0]?.totalDuration || 0,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error calculating total break duration', error: error.message });
    }
  },
};

module.exports = breakTimeController;
