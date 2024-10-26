import { find } from '../models/user.model';
import { find as _find } from '../models/leaves';
import { find as __find } from '../models/payroll';
import { CheckInOut } from '../models/schmeaESS';


export async function getOverView(req, res) {
    try {
      const { startDate, endDate } = req.query;
      
      // Fetch all employees
      const employees = await find();
      
      // Fetch checks within date range
      const checks = await CheckInOut.find({
        date: { $gte: new Date(startDate), $lte: new Date(endDate) }
      });
      
      // Fetch leaves within date range
      const leaves = await _find({
        date: { $gte: new Date(startDate), $lte: new Date(endDate) }
      });
      
      // Fetch payroll for the month
      const [year, month] = startDate.split('-');
      const payrolls = await __find({ year: parseInt(year), month: parseInt(month) });
      
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
  }

