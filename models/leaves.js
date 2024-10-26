const mongoose = require('mongoose');
const leaveSchema = new mongoose.Schema({
    employeeId: mongoose.Schema.Types.ObjectId,
    date: Date,
    type: String, // 'paid', 'unpaid', 'sick', etc.
  });

const Leave = mongoose.model('Leave', leaveSchema);
module.exports = Leave;