const db = require('../config/db');
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');
const { Schema } = mongoose;


// Define schema for Employees table
const shiftSchema = new Schema({
    name: { type: String, required: true },
    start: {type: String, required: true },
    end:{ type: String, required: true },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
  });




  
const ShiftModel = mongoose.model('user',shiftSchema);
module.exports = ShiftModel;