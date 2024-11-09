// leaveController.js
const Leave = require('../models/leaves');
const { io } = require('../server');
// Create a new leave request
exports.createLeave = async (req, res) => {
    try {

        const leaveRequest = new Leave(req.body);

        await leaveRequest.save();
         // Emit the new leave request event to all connected clients
        // io.emit('newLeaveRequest', leaveRequest);
        res.status(201).json({ message: 'Leave request created successfully', leaveRequest });
    } catch (error) {
        res.status(400).json({ message: 'Error creating leave request', error: error.message });
    }
};

// Get all leave requests
exports.getAllLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find();
        res.status(200).json(leaves);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching leave requests', error: error.message });
    }
};

// Get a specific leave request by ID
exports.getLeaveById = async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id);
        if (!leave) {
            return res.status(404).json({ message: 'Leave request not found' });
        }
        res.status(200).json(leave);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching leave request', error: error.message });
    }
};

// Update a leave request
exports.updateLeave = async (req, res) => {
    try {
        const leave = await Leave.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!leave) {
            return res.status(404).json({ message: 'Leave request not found' });
        }
        res.status(200).json({ message: 'Leave request updated successfully', leave });
    } catch (error) {
        res.status(400).json({ message: 'Error updating leave request', error: error.message });
    }
};

// Delete a leave request
exports.deleteLeave = async (req, res) => {
    try {
        const leave = await Leave.findByIdAndDelete(req.params.id);
        if (!leave) {
            return res.status(404).json({ message: 'Leave request not found' });
        }
        res.status(200).json({ message: 'Leave request deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting leave request', error: error.message });
    }
};