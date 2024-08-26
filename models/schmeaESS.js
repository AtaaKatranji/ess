const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
//
const productSchema = new mongoose.Schema({
    id: {},
    name:  { type: String, required: true , minlength: 3,maxlength: 50 },
    price: {type:String},
    desc :  { type: String, required: true , minlength: 3,maxlength: 50 }
})
// Define schema for Employees table
const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true , minlength: 3,maxlength: 50 },
    phoneNumber: { type: String, required: true,unique: true,
      lowercase: true,
      trim: true,
      },
    password: { type: String, required: true,minlength: 8 },
    // role: { type: String, required: true },
    // birthday: { type: Date, required: true },
    // address: { type: String, required: true },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
  });
  employeeSchema.methods.generateToken = async function() {
    const employee = this;
    const token = jwt.sign({ _id: employee._id.toString() }, process.env.JWT_SECRET);
    return token;
  };

// Define schema for Check In/Out table
const checkInOutSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  checkDate: { type: Date, required: true },
  checkInTime: { type: String, required: true },
  checkOutTime: { type: String, required: true },
  qrCodeOrIpAddress: { type: String, }
});
// Define the SubTask schema
const subTaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  toDoItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ToDoItem', // This should match the name of the ToDoItem model
    required: true,
  },
});

// Define the ToDoItem schema
const toDoItemSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  priority: {
    type: Number,
    required: true,
    min: 1, // Assuming priority starts from 1
    max: 5, // Assuming a maximum priority of 5
  },
  subTasks: [subTaskSchema], // Array of SubTask
});



// Define schema for Time Off Requests table
const timeOffRequestSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  requestDate: { type: Date, default: Date.now },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
});

// Define schema for Payroll and Financial Information table
const payrollSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  payDate: { type: Date, required: true },
  salary: { type: Number, required: true },
  taxWithholding: { type: Number },
  benefits: { type: String },
  pfDetails: { type: String }
});

// Create models based on the defined schemas
const Employee = mongoose.model('Employee', employeeSchema);
const CheckInOut = mongoose.model('CheckInOut', checkInOutSchema);
const TimeOffRequest = mongoose.model('TimeOffRequest', timeOffRequestSchema);
const Payroll = mongoose.model('Payroll', payrollSchema);
const Product = mongoose.model('Product', productSchema);
const SubTask = mongoose.model('SubTask', subTaskSchema);
const ToDoItem = mongoose.model('ToDoItem', toDoItemSchema);

module.exports = { Employee, CheckInOut, TimeOffRequest, Payroll,Product,SubTask,ToDoItem };