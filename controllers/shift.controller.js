const Shift = require('../models/shift');
const UserModel = require('../models/user.model');

// Create a new shift
const createShift = async (req, res) => {
  try {
    const shift = new Shift(req.body);
    await shift.save();
    res.status(201).json(shift);
  } catch (error) {
    res.status(400).json({ message: 'Error creating shift', error });
  }
};

// Get all shifts
const getAllShifts = async (req, res) => {
  try {
    const shifts = await Shift.find().populate('employees', 'name _id');
    res.status(200).json(shifts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shifts', error });
  }
};

// Get all institution's shifts
const getInstitutionShifts = async (req, res) => {
  const { institutionKey } = req.body;
  try {
    const shifts = await Shift.find({ institutionKey }).populate('employees', 'name _id');
    res.status(200).json(shifts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shifts', error });
  }
};

// Get a single shift by ID
const getShiftById = async (req, res) => {
  try {
    const shift = await Shift.findById(req.params.id).populate('employees', 'name _id');
    if (!shift) {
      return res.status(404).json({ message: 'Shift not found' });
    }
    res.status(200).json(shift);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shift', error });
  }
};

// Update a shift by ID
const updateShift = async (req, res) => {
  try {
    const shift = await Shift.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!shift) {
      return res.status(404).json({ message: 'Shift not found' });
    }
    await shift.populate('employees', 'name _id');
    res.status(200).json(shift);
  } catch (error) {
    res.status(400).json({ message: 'Error updating shift', error });
  }
};

// Assign an employee to a shift
const assignEmployee = async (req, res) => {
  try {
    const { id } = req.params; // Shift ID
    const { employeeId } = req.body;

    const shift = await Shift.findById(id);
    if (!shift) {
      return res.status(404).json({ message: 'Shift not found' });
    }

    if (!shift.employees.includes(employeeId)) {
      shift.employees.push(employeeId);
      await shift.save();
    }

    await shift.populate('employees', 'name _id');
    res.status(200).json(shift);
  } catch (error) {
    res.status(500).json({ message: 'Error assigning employee', error });
  }
};

// Remove employee from a shift
const removeEmployeeFromShift = async (req, res) => {
  try {
    const { shiftId } = req.params;
    const { employeeId } = req.body;

    const shift = await Shift.findByIdAndUpdate(
      shiftId,
      { $pull: { employees: employeeId } },
      { new: true }
    );

    if (!shift) {
      return res.status(404).json({ message: 'Shift not found' });
    }

    await shift.populate('employees', 'name _id');
    res.status(200).json(shift);
  } catch (error) {
    res.status(500).json({ message: 'Error removing employee', error });
  }
};

// Move employee from one shift to another
const moveEmployee = async (req, res) => {
  try {
    const { fromShiftId } = req.params;
    const { toShiftId, employeeId } = req.body;

    await Shift.findByIdAndUpdate(fromShiftId, { $pull: { employees: employeeId } });
    const updatedShift = await Shift.findByIdAndUpdate(
      toShiftId,
      { $addToSet: { employees: employeeId } },
      { new: true }
    ).populate('employees', 'name _id');

    if (!updatedShift) {
      return res.status(404).json({ message: 'One or both shifts not found' });
    }

    res.status(200).json(updatedShift);
  } catch (error) {
    res.status(500).json({ message: 'Error moving employee', error });
  }
};

// Delete a shift
const deleteShift = async (req, res) => {
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

// Get employee's shifts
const getEmployeeShifts = async (employeeId) => {
  try {
    return await Shift.find({ employees: employeeId }).select(
      'name startTime endTime days institutionKey'
    );
  } catch (error) {
    throw new Error('Error fetching shifts');
  }
};
const getTimeShift = async (req, res) => {
  const { employeeId } = req.body;

  try {
    const shifts = await getEmployeeShifts(employeeId);
    res.status(200).json({ success: true, shifts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createShift,
  getAllShifts,
  getInstitutionShifts,
  getShiftById,
  updateShift,
  assignEmployee,
  removeEmployeeFromShift,
  moveEmployee,
  deleteShift,
  getEmployeeShifts,
  getTimeShift,
}