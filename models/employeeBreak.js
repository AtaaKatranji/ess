const mongoose = require('mongoose');
const employeeBreakSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee', // Reference to Employee collection
    required: true
  },
  breakTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BreakType', // Reference to BreakType collection
    default: null // Null for custom breaks
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    default: null
  },
  duration: {
    type: Number, // Duration in minutes
    required: true
  },
  startTimeTaken: {
    type: Date,
    default: null
  },
  durationTaken: {
    type: Number, // Duration in minutes
    default: null
  },
 counterTime: {
    type: Number, // Duration in minutes
    default: null
  },
  isCustomBreak: {
    type: Boolean,
    default: false // True for custom breaks
  },
  customBreakName: {
    type: String, // Optional name for custom breaks
    default: null
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', null], // Allow null for non-custom breaks
    default: null // Default to null, but will be overridden in pre-save hook
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to set status conditionally
employeeBreakSchema.pre('save', function (next) {
  if (this.isCustomBreak && !this.status) {
    this.status = 'Pending'; // Set status to 'Pending' for custom breaks
  } else if (!this.isCustomBreak) {
    this.status = null; // Set status to null for non-custom breaks
  }
  next();
});
// Middleware to automatically calculate `duration`
employeeBreakSchema.pre('save', function (next) {
  if(this.isCustomBreak){
    if (this.startTime && this.endTime) {
      const duration = (this.endTime - this.startTimetaken) / (1000 * 60); // Convert ms to minutes
      this.durationTaken = duration;
    }
  }
  next();
});

module.exports = mongoose.model('EmployeeBreak', employeeBreakSchema);