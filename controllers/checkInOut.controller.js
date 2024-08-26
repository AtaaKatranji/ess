const CheckInOut = require('../models/checkInOut');

// Check In
exports.checkIn = async (req, res) => {
  try {
    const { employeeId, checkInTime } = req.body;
    const checkDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

    // Create a new check-in record
    const checkInOut = new CheckInOut({
      employeeId,
      checkDate,
      checkInTime,
      qrCodeOrIpAddress
    });

    await checkInOut.save();
    res.status(201).json({ message: 'Checked in successfully', checkInOut });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Check Out
exports.checkOut = async (req, res) => {
  try {
    const { employeeId, checkOutTime } = req.body;
    const checkDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

    // Find the check-in record for today
    const checkInOut = await CheckInOut.findOne({ employeeId, checkDate });

    if (!checkInOut) {
      return res.status(404).json({ message: 'Check-in record not found' });
    }

    // Update the check-out time
    checkInOut.checkOutTime = checkOutTime;
    await checkInOut.save();

    res.status(200).json({ message: 'Checked out successfully', checkInOut });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Check-In/Out History
exports.getHistory = async (req, res) => {
  try {
    const { employeeId } = req.params;

    // Find all check-in/out records for the employee
    const history = await CheckInOut.find({ employeeId }).sort({ checkDate: -1 });

    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
