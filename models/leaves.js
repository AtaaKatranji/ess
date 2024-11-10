const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Reference to the User model
        required: true // Optional: enforce that this field is required
    },
    startDate: {
        type: Date,
        required: true // Optional: enforce that this field is required
    },
    endDate: {
        type: Date,
        required: true // Optional: enforce that this field is required
    },
    type: {
        type: String,
        enum: ['Paid', 'Unpaid'], // Restrict to specific values
        required: true // Optional: enforce that this field is required
    },
    status: {
        type: String,
        default: 'Pending' // Default status
    },
    reason: {
        type: String,
        required: true // Optional: enforce that this field is required
    }
});

const Leave = mongoose.model('Leave', leaveSchema);
module.exports = {Leave};