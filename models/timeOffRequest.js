// const mongoose = require('mongoose');
// const timeOffRequestSchema = new mongoose.Schema({
//     employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
//     requestDate: { type: Date, default: Date.now },
//     startDate: { type: Date, required: true },
//     endDate: { type: Date, required: true },
//     reason: { type: String, required: true },
//     status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
//   });

// const TimeOffRequest = mongoose.model('TimeOffRequest', timeOffRequestSchema);
// module.exports(TimeOffRequest);