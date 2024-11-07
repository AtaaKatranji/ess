const mongoose = require('mongoose');
const leaveSchema = new mongoose.Schema({
    employeeId: mongoose.Schema.Types.ObjectId,
    startDate: Date,
    endDate: Date,
    type: String, // 'paid', 'unpaid'.
    reason: String, 
  });

const Leave = mongoose.model('Leave', leaveSchema);
module.exports = Leave;