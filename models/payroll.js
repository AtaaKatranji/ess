const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
    employeeId: mongoose.Schema.Types.ObjectId,
    month: Number,
    year: Number,
    totalHours: Number,
    totalPay: Number,
  });

  const Payroll = mongoose.models.Payroll || mongoose.model('Payroll', payrollSchema);

  module.exports = Payroll;