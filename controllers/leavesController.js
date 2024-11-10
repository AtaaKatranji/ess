// leaveController.js
const {Leave} = require('../models/leaves');
const UserModel = require('../models/user.model');
const Subscription = require('../models/Subscription');
const moment = require('moment-timezone'); 
exports.createLeave = async (req, res) => {
    try {
        const leaveRequest = new Leave(req.body);
        await leaveRequest.save()
        
        // const employee = await UserModel.findById(leaveRequest.employeeId); 

        // // Prepare the push notification payload
        // const subscriptions = await Subscription.find({ role: 'admin' });

        // // Send push notification to each admin
        // subscriptions.forEach(async (subscription) => {
        //     const pushPayload = JSON.stringify({
        //         title: 'New Leave Request',
        //         message: `A new leave request has been submitted by ${employee ? employee.name : 'Unknown Employee'}`,
        //         url: `/leave-requests/${leaveRequest._id}`, // URL to view the leave request
        //     });

        //     try {
        //         // Send the push notification
        //         await webPush.sendNotification(subscription, pushPayload);
        //     } catch (error) {
        //         console.error('Error sending push notification', error);
        //     }
        // });

        // Prepare a response with leave requests including employee names
        const leaveRequests = await Leave.find().populate('employeeId'); // Assuming employeeId is a reference field

        // Map through leaveRequests to replace employeeId with employee name
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
exports.getAllLeaves = async (req, res) => {
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
// Get Monthly for one employee leave requests
// Get Monthly leave requests for one employee
exports.getEmployeeMonthLeaves = async (req, res) => {
    const employeeId = req.body['userId'];
    const month = req.body['month'];
    const date = moment(new Date(month));

    // Start and end of the month
    const startDate = date.startOf('month').format("YYYY-MM-DD");
    // const endDate = date.endOf('month').format("YYYY-MM-DD");
    const endDate = date.clone().add(1, 'month').startOf('month').format("YYYY-MM-DD"); // Make sure getMonthNumber correctly returns the month as an integer (0-11)
    console.log(startDate,endDate)
    try {
                // Find approved leave requests for the specified employee and month
                const leaves = await Leave.find({
                    employeeId,
                    status: 'Approved', // Only include approved leave requests
                    startDate:{ $gte: startDate, $lt: endDate },
                })
                console.log(leaves)
               // Calculate the number of paid and unpaid leaves
               const paidLeaves = leaves.filter(req => req.type === 'Paid').length;
               const unpaidLeaves = leaves.filter(req => req.type === 'Unpaid').length;
               // Return the counts
               res.status(200).json({ paidLeaves, unpaidLeaves });
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
exports.approveLeaveRequest = async (req, res) => {
    const { id } = req.params; // Assuming you're sending the ID in the URL params

    try {
        // Find the leave request by ID and update its status
        const updatedLeave = await Leave.findByIdAndUpdate(
            id,
            { status: 'Approved' },
            { new: true } // Return the updated document
        );

        if (!updatedLeave) {
            return res.status(404).json({ message: 'Leave request not found' });
        }

        res.status(200).json({ message: 'Leave request approved successfully', leaveRequest: updatedLeave });
    } catch (error) {
        res.status(500).json({ message: 'Error updating leave request', error: error.message });
    }
};
exports.rejectLeaveRequest = async (req, res) => {
    const { id } = req.params; // Assuming you're sending the ID in the URL params

    try {
        // Find the leave request by ID and update its status
        const updatedLeave = await Leave.findByIdAndUpdate(
            id,
            { status: 'Rejected' },
            { new: true } // Return the updated document
        );

        if (!updatedLeave) {
            return res.status(404).json({ message: 'Leave request not found' });
        }

        res.status(200).json({ message: 'Leave request reject successfully', leaveRequest: updatedLeave });
    } catch (error) {
        res.status(500).json({ message: 'Error updating leave request', error: error.message });
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