const User = require('../models/user.model');
const Leave = require('../models/leaves');
const Payroll = require('../models/payroll');
const {CheckInOut} = require('../models/schmeaESS');


exports.getOverView = async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      // Fetch all employees
      const employees = await User.find();
      
      // Fetch checks within date range
      const checks = await CheckInOut.find({
        checkDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
      });
      
      console.log();
      // Fetch leaves within date range
      const leaves = await Leave.find({
        
        date: { $gte: new Date("2024-10-25"), $lte: new Date("2024-10-25") }
      });
      
      // Fetch payroll for the month
      const [year, month] = startDate.split('-');
      const payrolls = await Payroll.find({ year: parseInt(year), month: parseInt(month) });
      
      // Combine data
      const combinedData = employees.map(employee => {
        const employeeChecks = checks.filter(check => check.employeeId.equals(employee._id));
        const employeeLeaves = leaves.filter(leave => leave.employeeId.equals(employee._id));
        const employeePayroll = payrolls.find(payroll => payroll.employeeId.equals(employee._id));
        
        return {
          id: employee._id,
          name: employee.name,
          position: employee.position,
          hourlyRate: employee.hourlyRate,
          checks: employeeChecks,
          leaves: employeeLeaves,
          payroll: employeePayroll
        };
      });
      
      res.json(combinedData);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

