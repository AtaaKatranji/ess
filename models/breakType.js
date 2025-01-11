const mongoose = require('mongoose');
const breakTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true // Ensure break type names are unique
  },
  duration: {
    type: Number, // Duration in minutes
    required: true
  },
  shiftId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shift', // Reference to Shift collection
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

module.exports = mongoose.model('BreakType', breakTypeSchema);