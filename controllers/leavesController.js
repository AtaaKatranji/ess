// leaveController.js
const Leave = require('../models/leaves');
const Subscription = require('../models/Subscription');

exports.createLeave = async (req, res) => {
    try {
        const leaveRequest = new Leave(req.body);
        await leaveRequest.save()
        // Prepare the push notification payload
        

        // Get the admin's push subscription object from your database
        const subscriptions = await Subscription.find({ role: 'admin' });


       // Send push notification to each admin
       subscriptions.forEach(async (subscription) => {
        const pushPayload = JSON.stringify({
            title: 'New Leave Request',
            message: `A new leave request has been submitted by ${leaveRequest.user}`,
            url: `/leave-requests/${leaveRequest._id}`, // URL to view the leave request
        });

        try {
            // Send the push notification
            await webPush.sendNotification(subscription, pushPayload);
        } catch (error) {
            console.error('Error sending push notification', error);
        }
    });

        // Emit the real-time event using Pusher Channels
        // pusher.trigger('leave-channel', 'newLeaveRequest', leaveRequest);

        // // Send a push notification using Pusher Beams
        // beamsClient.publishToInterests(['admin-notifications'], {
        //     web: {
        //         notification: {
        //             title: 'New Leave Request',
        //             body: `A new leave request has been created.`,
        //             deep_link: `https://ess-admin-lime.vercel.app/notification`
        //         }
        //     }
        // });

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