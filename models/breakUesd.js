const mongoose = require('mongoose');
const breakUesdSchema = new mongoose.Schema({
  breakId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BreakType', // Reference to Shift collection
    required: true // Ensure break type names are unique
  },
  isUsed: {
    type: Boolean, // Duration in minutes
    required: true
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', // Reference to Shift collection
    required: true
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

module.exports = mongoose.model('BreakUsed', breakUesdSchema);