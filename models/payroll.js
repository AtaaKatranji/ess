const mongoose = require('mongoose');
// const payrollSchema = new mongoose.Schema({
//     employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
//     payDate: { type: Date, required: true },
//     salary: { type: Number, required: true },
//     taxWithholding: { type: Number },
//     benefits: { type: String },
//     pfDetails: { type: String }
//   });
  
// module.exports = mongoose.model("Payroll", payrollSchema);
const payrollSchema = new mongoose.Schema({
    employeeId: mongoose.Schema.Types.ObjectId,
    month: Number,
    year: Number,
    totalHours: Number,
    totalPay: Number,
  });

const Payroll = mongoose.model('Payroll', payrollSchema);
module.exports = Payroll;