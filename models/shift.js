const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  days: {
    type: [String],
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  },
  employees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: []
  }],
  institutionKey: {
    type: String,
    required:true
  },
  lateMultiplier: { 
    type: Number, 
    required: true,
    default: 1
  },
  lateLimit: {
    type: Number,
    required: true,
    default: 5
  },
  extraMultiplier: {
    type: Number, 
    required: true,
    default: 1
  },
  extraLimit: {
    type: Number, 
    required: true,
    default: 60
  },
  
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Shift', shiftSchema);
