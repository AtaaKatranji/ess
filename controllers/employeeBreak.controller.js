const EmployeeBreak = require('../models/employeeBreak');

// Record a new employee break
exports.createEmployeeBreak = async (req, res) => {
  try {
    const { employeeId, breakTypeId, startTime, duration, isCustomBreak, customBreakName } = req.body;

    const newEmployeeBreak = new EmployeeBreak({
      employeeId,
      breakTypeId,
      startTime,
      duration,
      isCustomBreak: isCustomBreak || false, // Default to false if not provided
      customBreakName: isCustomBreak ? customBreakName : null, // Only include if isCustomBreak is true
    });

    await newEmployeeBreak.save();
    res.status(201).json({ message: 'Employee break recorded successfully', data: newEmployeeBreak });
  } catch (error) {
    res.status(400).json({ message: 'Error recording employee break', error: error.message });
  }
};
exports.requestCustomBreak = async (req, res) => {
  try {
    const { employeeId, startTime, duration, customBreakName } = req.body;

    // Create a new custom break with status 'Pending'
    const newCustomBreak = new EmployeeBreak({
      employeeId,
      startTime,
      duration,
      isCustomBreak: true,
      customBreakName,
      status: 'Pending'
    });

    await newCustomBreak.save();

    res.status(201).json({ message: 'Custom break request submitted successfully', data: newCustomBreak });
  } catch (error) {
    res.status(400).json({ message: 'Error submitting custom break request', error: error.message });
  }
};
// Get all employee breaks
exports.getAllEmployeeBreaks = async (req, res) => {
  try {
    const employeeBreaks = await EmployeeBreak.find()
      .populate('employeeId')
      .populate('breakTypeId');
    res.status(200).json({ message: 'Employee breaks fetched successfully', data: employeeBreaks });
  } catch (error) {
    res.status(400).json({ message: 'Error fetching employee breaks', error: error.message });
  }
};
// Get a single employee break by ID
exports.getEmployeeBreakById = async (req, res) => {
  try {
    const employeeBreak = await EmployeeBreak.findById(req.params.id)
      .populate('employeeId')
      .populate('breakTypeId');
    if (!employeeBreak) {
      return res.status(404).json({ message: 'Employee break not found' });
    }
    res.status(200).json({ message: 'Employee break fetched successfully', data: employeeBreak });
  } catch (error) {
    res.status(400).json({ message: 'Error fetching employee break', error: error.message });
  }
};
// Update an employee break
exports.updateEmployeeBreak = async (req, res) => {
  try {
    const { employeeId, breakTypeId, startTime, endTime, isCustomBreak, customBreakName } = req.body;
    const employeeBreak = await EmployeeBreak.findByIdAndUpdate(
      req.params.id,
      { employeeId, breakTypeId, startTime, endTime, isCustomBreak, customBreakName },
      { new: true }
    );
    if (!employeeBreak) {
      return res.status(404).json({ message: 'Employee break not found' });
    }
    res.status(200).json({ message: 'Employee break updated successfully', data: employeeBreak });
  } catch (error) {
    res.status(400).json({ message: 'Error updating employee break', error: error.message });
  }
};
// Delete an employee break
exports.deleteEmployeeBreak = async (req, res) => {
  try {
    const employeeBreak = await EmployeeBreak.findByIdAndDelete(req.params.id);
    if (!employeeBreak) {
      return res.status(404).json({ message: 'Employee break not found' });
    }
    res.status(200).json({ message: 'Employee break deleted successfully', data: employeeBreak });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting employee break', error: error.message });
  }
};
// Get all custom breaks for a specific employee
exports.getCustomBreaksByEmployeeId = async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    const customBreaks = await EmployeeBreak.find({ employeeId, isCustomBreak: true })
      .populate('employeeId')
      .populate('breakTypeId'); // Optional: Populate related fields

    if (customBreaks.length === 0) {
      return res.status(404).json({ message: 'No custom breaks found for this employee' });
    }

    res.status(200).json({ message: 'Custom breaks fetched successfully', data: customBreaks });
  } catch (error) {
    res.status(400).json({ message: 'Error fetching custom breaks', error: error.message });
  }
};
// Get all specific custom breaks for a specific employee
exports.getSpecificCustomBreaksByEmployeeId = async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    const { customBreakName, startDate, endDate } = req.query;

    // Build the query object
    const query = { employeeId, isCustomBreak: true };

    // Add optional filters
    if (customBreakName) {
      query.customBreakName = customBreakName;
    }

    // Fetch custom breaks
    const customBreaks = await EmployeeBreak.find(query)
      .populate('employeeId')
      .populate('breakTypeId'); // Optional: Populate related fields

    if (customBreaks.length === 0) {
      return res.status(404).json({ message: 'No custom breaks found for this employee with the specified filters' });
    }

    res.status(200).json({ message: 'Custom breaks fetched successfully', data: customBreaks });
  } catch (error) {
    res.status(400).json({ message: 'Error fetching custom breaks', error: error.message });
  }
};
// Approve or reject a custom break
exports.updateBreakStatus = async (req, res) => {
  try {
    const { breakId } = req.params;
    const { status } = req.body;

    // Validate status
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be "Approved" or "Rejected".' });
    }

    // Find the break
    const employeeBreak = await EmployeeBreak.findById(breakId);
    if (!employeeBreak) {
      return res.status(404).json({ message: 'Break not found' });
    }

    // Update status and calculate endTime if approved
    employeeBreak.status = status;
    if (status === 'Approved') {
      employeeBreak.endTime = new Date(employeeBreak.startTimeTaken.getTime() + employeeBreak.duration * 60 * 1000);
    }

    await employeeBreak.save();

    res.status(200).json({ message: `Break ${status.toLowerCase()} successfully`, data: employeeBreak });
  } catch (error) {
    res.status(400).json({ message: 'Error updating break status', error: error.message });
  }
};
// Track break time
exports.trackBreakTime = async (req, res) => {
  try {
    const { breakId } = req.params;
    const { endTime } = req.body;

    // Find the break
    const employeeBreak = await EmployeeBreak.findById(breakId);
    if (!employeeBreak) {
      return res.status(404).json({ message: 'Break not found' });
    }

    // Update endTime and calculate durationTaken
    employeeBreak.endTime = endTime;
    await employeeBreak.save();

    res.status(200).json({ message: 'Break time tracked successfully', data: employeeBreak });
  } catch (error) {
    res.status(400).json({ message: 'Error tracking break time', error: error.message });
  }
};