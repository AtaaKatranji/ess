// Model: extraHoursAdjustment.model.js
const mongoose = require('mongoose');

const extraHoursAdjustmentSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  addedHours: {
    type: Number,
    required: true,
    min: 0,
  },
  month: {
    type: Number,
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
  reason: {
    type: String,
    required: true,
    trim: true,
  },
});

const ExtraHoursAdjustment = mongoose.model('ExtraHoursAdjustment', extraHoursAdjustmentSchema);
module.exports = {ExtraHoursAdjustment};