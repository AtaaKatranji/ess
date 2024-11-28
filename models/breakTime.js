const mongoose = require('mongoose');

const breakTimeSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee', // Reference to Employee collection
    required: true
  },
  checkInId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CheckInOut', // Reference to CheckInOut collection
    required: true
  },
  breakStart: {
    type: Date,
    required: true
  },
  breakEnd: {
    type: Date,
    default: null
  },
  breakDuration: {
    type: Number, // Store duration in minutes
    default: null
  },
  breakType: {
    type: String,
    enum: ['Lunch', 'Coffee', 'Personal', 'Other'], // Optional categorization of breaks
    default: 'Other'
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

// Middleware to automatically calculate `breakDuration`
breakTimeSchema.pre('save', function (next) {
  if (this.breakStart && this.breakEnd) {
    const duration = (this.breakEnd - this.breakStart) / (1000 * 60); // Convert ms to minutes
    this.breakDuration = duration;
  }
  next();
});

module.exports = mongoose.model('BreakTime', breakTimeSchema);
