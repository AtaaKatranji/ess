const { Leave } = require('../models/leaves');
const UserModel = require('../models/user.model');
const Subscription = require('../models/Subscription');
const moment = require('moment-timezone');

// Create a leave request
const createLeave = async (req, res) => {
    try {
        const leaveRequest = new Leave(req.body);
        await leaveRequest.save();

        // Prepare a response with leave requests including employee names
        const leaveRequests = await Leave.find().populate('employeeId');
        const leaveRequestsWithNames = leaveRequests.map(req => ({
            ...req.toObject(),
            employeeName: req.employeeId ? req.employeeId.name : 'Unknown Employee',
            employeeId: undefined // Optionally remove employeeId if not needed
        }));

        res.status(201).json({ message: 'Leave request created successfully', leaveRequests: leaveRequestsWithNames });
    } catch (error) {
        res.status(400).json({ message: 'Error creating leave request', error: error.message });
    }
};

// Get all leave requests
const getAllLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find().populate('employeeId');
        const leaveRequestsWithNames = leaves.map(req => ({
            ...req.toObject(),
            employeeName: req.employeeId ? req.employeeId.name : 'Unknown Employee',
            employeeId: undefined // Optionally remove employeeId if not needed
        }));

        res.status(200).json(leaveRequestsWithNames);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching leave requests', error: error.message });
    }
};

// Get Monthly leave requests for one employee
const getEmployeeMonthLeaves = async (req, res) => {
    const employeeId = req.body['userId'];
    const month = req.body['month'];

    // Input validation
    if (!employeeId || !month) {
        return res.status(400).json({ message: 'Invalid input. Please provide both employee ID and month.' });
    }

    try {
        const result = await fetchEmployeeLeavesForMonth(employeeId, month);
        const resultDays = await fetchEmployeeLeaveDayForMonth(employeeId, month);
        res.status(200).json(result,resultDays);
    } catch (error) {
        console.error(error); // Log error for debugging purposes
        res.status(500).json({ message: 'Error fetching leave requests', error: error.message });
    }
};

// Get a specific leave request by ID
const getLeaveById = async (req, res) => {
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
const updateLeave = async (req, res) => {
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

// Approve a leave request
const approveLeaveRequest = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedLeave = await Leave.findByIdAndUpdate(id, { status: 'Approved' }, { new: true });
        if (!updatedLeave) {
            return res.status(404).json({ message: 'Leave request not found' });
        }
        res.status(200).json({ message: 'Leave request approved successfully', leaveRequest: updatedLeave });
    } catch (error) {
        res.status(500).json({ message: 'Error updating leave request', error: error.message });
    }
};

// Reject a leave request
const rejectLeaveRequest = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedLeave = await Leave.findByIdAndUpdate(id, { status: 'Rejected' }, { new: true });
        if (!updatedLeave) {
            return res.status(404).json({ message: 'Leave request not found' });
        }
        res.status(200).json({ message: 'Leave request rejected successfully', leaveRequest: updatedLeave });
    } catch (error) {
        res.status(500).json({ message: 'Error updating leave request', error: error.message });
    }
};

// Delete a leave request
const deleteLeave = async (req, res) => {
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

// Reusable function to get employee leaves for a specific month
const fetchEmployeeLeavesForMonth = async (employeeId, month) => {
    const date = moment(new Date(month));
    const startDate = date.startOf('month').format("YYYY-MM-DD");
    const endDate = date.clone().add(1, 'month').startOf('month').format("YYYY-MM-DD");

    console.log(startDate, endDate);

    // Find approved leave requests for the specified employee and month
    const leaves = await Leave.find({
        employeeId,
        
        startDate: { $gte: startDate, $lt: endDate },
    });

    // Initialize counters for paid and unpaid leave days
    let totalPaidLeaveDays = 0;
    let totalUnpaidLeaveDays = 0;

    // Calculate the count of days for each leave request and accumulate totals
    const leavesWithDaysCount = leaves.map(leave => {
        const leaveStartDate = moment(leave.startDate);
        const leaveEndDate = moment(leave.endDate);
        const durationInDays = leaveEndDate.diff(leaveStartDate, 'days') + 1; // Include both start and end dates

        // Accumulate total days based on leave type
        if (leave.type === 'Paid') {
            totalPaidLeaveDays += durationInDays;
        } else if (leave.type === 'Unpaid') {
            totalUnpaidLeaveDays += durationInDays;
        }

        return { ...leave.toObject(), durationInDays };
    });

    return {  leaves: leavesWithDaysCount };
};
const fetchEmployeeLeaveDayForMonth = async (employeeId, month) => {
    const date = moment(new Date(month));
    const startDate = date.startOf('month').format("YYYY-MM-DD");
    const endDate = date.clone().add(1, 'month').startOf('month').format("YYYY-MM-DD");

    console.log(startDate, endDate);

    // Find approved leave requests for the specified employee and month
    const leaves = await Leave.find({
        employeeId,
        status: 'Approved',
        startDate: { $gte: startDate, $lt: endDate },
    });

    // Initialize counters for paid and unpaid leave days
    let totalPaidLeaveDays = 0;
    let totalUnpaidLeaveDays = 0;

    // Calculate the count of days for each leave request and accumulate totals
    const leavesWithDaysCount = leaves.map(leave => {
        const leaveStartDate = moment(leave.startDate);
        const leaveEndDate = moment(leave.endDate);
        const durationInDays = leaveEndDate.diff(leaveStartDate, 'days') + 1; // Include both start and end dates

        // Accumulate total days based on leave type
        if (leave.type === 'Paid') {
            totalPaidLeaveDays += durationInDays;
        } else if (leave.type === 'Unpaid') {
            totalUnpaidLeaveDays += durationInDays;
        }

        return { ...leave.toObject(), durationInDays };
    });

    return { totalPaidLeaveDays, totalUnpaidLeaveDays };
};


// Export all functions as named exports
module.exports = {
    createLeave,
    getAllLeaves,
    getEmployeeMonthLeaves,
    getLeaveById,
    updateLeave,
    approveLeaveRequest,
    rejectLeaveRequest,
    deleteLeave,
    fetchEmployeeLeavesForMonth,
};