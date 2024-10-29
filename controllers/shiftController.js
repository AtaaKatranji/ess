const Shift = require('../models/shift');

// Create a new shift
exports.createShift = async (req, res) => {
  try {
    const shift = new Shift(req.body);
    await shift.save();
    res.status(201).json(shift);
  } catch (error) {
    res.status(400).json({ message: 'Error creating shift', error });
  }
};

// Get all shifts
exports.getAllShifts = async (req, res) => {
    try {
      const shifts = await Shift.find().populate({
        path: 'users',
        options: { strictPopulate: false }, // allows for an empty array on population
      });
      res.status(200).json(shifts);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching shifts', error });
    }
  };
  // Get all institution's shifts
exports.getInstitutionShifts = async (req, res) => {
  const { institutionKey } = req.body;
  try {
    const shifts = await Shift.find({institutionKey}).populate({
      path: 'users',
      options: { strictPopulate: false }, // allows for an empty array on population
    });
    res.status(200).json(shifts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shifts', error });
  }
};
// Get a single shift by ID
exports.getShiftById = async (req, res) => {
  try {
    const shift = await Shift.findById(req.params.id).populate('employees');
    if (!shift) {
      return res.status(404).json({ message: 'Shift not found' });
    }
    res.status(200).json(shift);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shift', error });
  }
};

// Update a shift by ID
exports.updateShift = async (req, res) => {
  try {
    const shift = await Shift.findByIdAndUpdate(req.params.id, req.body, { new: true });
    console.log(shift)
    if (!shift) {
      return res.status(404).json({ message: 'Shift not found' });
    }
    res.status(200).json(shift);
  } catch (error) {
    res.status(400).json({ message: 'Error updating shift', error });
  }
};

exports.assignEmployee = async (req, res) => {
  try {
    const shiftId = req.params.id;
    const { employeeId } = req.body;

    // Find the shift by ID
    const shift = await Shift.findById(shiftId);
    if (!shift) {
      return res.status(404).json({ message: 'Shift not found' });
    }

    // Check if the employee is already assigned to prevent duplicates
    if (!shift.employees.includes(employeeId)) {
      shift.employees.push(employeeId);
    }

    // Save the updated shift
    
    await shift.save();

    // Send the updated shift data in the response
    res.status(200).json(shift);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
// Remove employee from shift
exports.removeEmployeeFromShift = async (req, res) => {
  try {
    const { shiftId } = req.params;
    const { employeeId } = req.body;
    
    // Find the shift by ID and remove the employeeId
    const updatedShift = await Shift.findByIdAndUpdate(
      shiftId,
      { $pull: { employees: employeeId } }, // Assuming 'employees' is an array of employee IDs
      { new: true } // Return the updated document
    );

    if (!updatedShift) {
      return res.status(404).json({ error: 'Shift not found' });
    }

    res.json(updatedShift);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

    
// Move employee from one shift to another
exports.moveEmployee = async (req, res) => {
  try {
    const { fromShiftId } = req.params;
    const { toShiftId, employeeId } = req.body;

    // Find the source shift and remove the employeeId
    const fromShift = await Shift.findByIdAndUpdate(
      fromShiftId,
      { $pull: { employees: employeeId } }, // Remove employee from the source shift
      { new: true }
    );

    // Find the destination shift and add the employeeId
    const toShift = await Shift.findByIdAndUpdate(
      toShiftId,
      { $addToSet: { employees: employeeId } }, // Add employee to the destination shift
      { new: true }
    );

    if (!fromShift || !toShift) {
      return res.status(404).json({ error: 'One or both shifts not found' });
    }

    res.json(toShift); // Return the updated destination shift
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


// Delete a shift by ID
exports.deleteShift = async (req, res) => {
  try {
    const shift = await Shift.findByIdAndDelete(req.params.id);
    if (!shift) {
      return res.status(404).json({ message: 'Shift not found' });
    }
    res.status(200).json({ message: 'Shift deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting shift', error });
  }
};
