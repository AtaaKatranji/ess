const {CheckInOut} = require('../models/schmeaESS');
const {Leave} = require('../models/leaves');
const Shift = require('../models/shift');
const moment = require('moment-timezone'); 
const mongoose = require('mongoose');
const { fetchShifts } = require('../controllers/shiftController');
const { fetchEmployeeLeavesForMonth } = require('../controllers/leavesController');
//---------- Helper Functions ----------
const  getMonthNumber = (month) => { 
  const monthMap = {
    "January": 1,
    "February": 2,
    "March": 3,
    "April": 4,
    "May": 5,
    "June": 6,
    "July": 7,
    "August": 8,
    "September": 9,
    "October": 10,
    "November": 11,
    "December": 12,
  };

  return monthMap[month] ?? -1; // Return -1 if the month is not found
}

// converter 12 system to 24 system
const convertTo24HourFormat = (time) => {
  console.log(time)
  console.log(time.split(' '))
  let [timeString, modifier] = time.split(' ');
  let [hours, minutes] = timeString.split(':').map(Number);

  if (modifier === 'PM' && hours !== 12) {
      hours += 12;
  } else if (modifier === 'AM' && hours === 12) {
      hours = 0;
  }

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}
// converter 24 system to 12 system
function convertTo12Hour(time24) {
  let [hours, minutes] = time24.split(':');
  hours = parseInt(hours);

  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // Convert to 12-hour format and handle 00 as 12

  return `${hours}:${minutes} ${period}`;
}
//checker
function checkTimeFormat12(time) {
  // Regex for 12-hour format
  const regex12Hour = /^(0?[1-9]|1[0-2]):[0-5][0-9] ?([AP]M)$/i;
  
  // Regex for 24-hour format
  const regex24Hour = /^(2[0-3]|[01]?[0-9]):[0-5][0-9]$/;

  if (regex12Hour.test(time)) {
      return time;
  } else if (regex24Hour.test(time)) {
      return convertTo12Hour(time);
  } else {
      return 'Invalid time format';
  }
}
//daily hours 
// Helper function to calculate daily hours
function calculateDailyHours(checkIn, checkOut) {
  let totalMinutes = 0;
  if( checkOut == null){
    return;
    }else{
  const checkInTime = moment(convertTo24HourFormat(checkIn), 'HH:mm');
  const checkOutTime = moment(convertTo24HourFormat(checkOut), 'HH:mm');

  // Calculate total minutes worked
  totalMinutes += Math.abs(checkOutTime.diff(checkInTime, 'minutes'));
  const totalHours = (totalMinutes / 60).toFixed(2);
  return totalHours;
}
}

// Calculate Total Hours
const calculateTotalHours = async (employeeId, dateString) => {
  const date = moment(new Date(dateString));

  // Start and end of the month
  const startDate = date.startOf('month').format("YYYY-MM-DD");
  const endDate = date.clone().add(1, 'month').startOf('month').format("YYYY-MM-DD");
  
  try {
    console.log(startDate,endDate)
      const sessions = await CheckInOut.find({
          employeeId: new mongoose.Types.ObjectId(employeeId),
          checkDate: { $gte: startDate, $lt: endDate },
      });
      console.log(sessions);
      let totalMinutes = 0;
      let checkOutTime;
      let checkInTime;
      let checkInT;
      let checkOutT;

      sessions.forEach(entry => {
        if( entry.checkOutTime == null){
          return;
          }else{
            checkInT=convertTo24HourFormat(entry.checkInTime);
            checkInTime = moment(checkInT, 'HH:mm');
            checkOutT= convertTo24HourFormat(entry.checkOutTime);
            checkOutTime = moment(checkOutT, 'HH:mm');
          }
          totalMinutes += Math.abs(checkOutTime.diff(checkInTime, 'minutes'));
      });
      const totalHours = (totalMinutes / 60).toFixed(2);
      
      return { totalHours, totalMinutes };
  } catch (err) {
      console.error('Error calculating total hours:', err);
  }
};
  
const calculateTotalLateHours = async (employeeId, month, year) => {
  let startDate = new Date(year, month - 1);
  let endDate;
  const now = new Date();
  if (now.getFullYear() === year && now.getMonth() === month - 1) {
      // If the current date is in the specified month and year
      endDate = new Date(year, month - 1, now.getDate()); // Start of today
  } else {
      // Otherwise, set endDate to the start of the next month
      endDate = new Date(year, month, 1);
  }
  try {
      const sessions = await CheckInOut.find({
          employeeId: new mongoose.Types.ObjectId(employeeId),
          checkDate: { $gte: startDate, $lt: endDate },
      });
      let lateMinutes = 0;
      let extraMInutes = 0;
      let checkOutTime;
      let checkInTime;


      sessions.forEach(entry => {
        if( entry.checkOutTime == null){
          return;
          }else{
            checkInTime = moment( convertTo24HourFormat(entry.checkInTime), 'HH:mm');
            checkOutTime = moment(convertTo24HourFormat(entry.checkOutTime), 'HH:mm');
          }
          console.log(Math.abs(checkOutTime.diff(checkInTime, 'minutes')))
          const diffInMinutes = 480 - Math.abs(checkOutTime.diff(checkInTime, 'minutes'));
          console.log(diffInMinutes)
          if(diffInMinutes<=0){
             extraMInutes += Math.abs(diffInMinutes);
          }else{
             lateMinutes += Math.abs(diffInMinutes);
          }
      });
      const totalExtraHours = (extraMInutes / 60).toFixed(2);
      const totalLateHours = (lateMinutes / 60).toFixed(2);
      console.log(`Extra And lates Hours worked by employee ${employeeId} in month:${month} ${totalExtraHours}:${totalLateHours}`);
      return [ totalExtraHours, totalLateHours ];
  } catch (err) {
      console.error('Error calculating Ex/La hours:', err);
  }
};  
//Time Shift 
const calculateTimeShift = async (employeeId, month, year, shiftStart, shiftEnd) => {
  let startDate = new Date(year, month - 1);
  let endDate;
  const now = new Date();
  if (now.getFullYear() === year && now.getMonth() === month - 1) {
      endDate = new Date(year, month - 1, now.getDate()); 
  } else {
      endDate = new Date(year, month, 1); 
  }

  try {
      const sessions = await CheckInOut.find({
          employeeId: new mongoose.Types.ObjectId(employeeId),
          checkDate: { $gte: startDate, $lt: endDate },
      });

      // Initialize counters
      let lateMinutes = 0;
      let earlyLeaveMinutes = 0;
      let earlyArrivalMinutes = 0;
      let extraAttendanceMinutes = 0;

      sessions.forEach(entry => {
        if (entry.checkOutTime == null) {
          return;
        } else {
          // Convert check-in/out times to moment objects
          const checkInTime = moment(convertTo24HourFormat(entry.checkInTime), 'HH:mm');
          const checkOutTime = moment(convertTo24HourFormat(entry.checkOutTime), 'HH:mm');

          // Convert shift start/end times to moment objects
          const shiftStartTime = moment(shiftStart, 'HH:mm');
          const shiftEndTime = moment(shiftEnd, 'HH:mm');

          // Calculate late arrival and early arrival
          if (checkInTime.isAfter(shiftStartTime)) {
            lateMinutes += checkInTime.diff(shiftStartTime, 'minutes');
          } else {
            earlyArrivalMinutes += shiftStartTime.diff(checkInTime, 'minutes');
          }

          // Calculate early leave and extra attendance
          if (checkOutTime.isBefore(shiftEndTime)) {
            earlyLeaveMinutes += shiftEndTime.diff(checkOutTime, 'minutes');
          } else {
            extraAttendanceMinutes += checkOutTime.diff(shiftEndTime, 'minutes');
          }
        }
      });

      // Convert total minutes to hours with two decimal points
      const totalLateHours = (lateMinutes / 60).toFixed(2);
      const totalEarlyLeaveHours = (earlyLeaveMinutes / 60).toFixed(2);
      const totalEarlyArrivalHours = (earlyArrivalMinutes / 60).toFixed(2);
      const totalExtraAttendanceHours = (extraAttendanceMinutes / 60).toFixed(2);

      console.log(`For employee ${employeeId} in month ${month}:`);
      console.log(`- Late Hours: ${totalLateHours}`);
      console.log(`- Early Leave Hours: ${totalEarlyLeaveHours}`);
      console.log(`- Early Arrival Hours: ${totalEarlyArrivalHours}`);
      console.log(`- Extra Attendance Hours: ${totalExtraAttendanceHours}`);

      return {
        lateHours: totalLateHours,
        earlyLeaveHours: totalEarlyLeaveHours,
        earlyArrivalHours: totalEarlyArrivalHours,
        extraAttendanceHours: totalExtraAttendanceHours
      };
  } catch (err) {
      console.error('Error calculating time shifts:', err);
  }
};

//---------Main Functions------------
// Check In
exports.checkIn = async (req, res) => {
  console.log(req.body);
    const { userId, checkInTime, timeZone } = req.body;
  try {
    let employeeObjectId = new mongoose.Types.ObjectId(userId);
    const checkDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

    // Create a new check-in record
    const checkIn = new CheckInOut({
      checkInTime: checkInTime, // The converted UTC datetime
      checkDate: checkDate, // Optionally, you can store the UTC date here as well
      employeeId: userId,
      checkOutTime: null,
      timeZone: timeZone // Still store the original timezone for future reference
    });
    console.log(checkIn);
    await checkIn.save();
      console.log(checkIn);
      console.log(`Work started at ${checkIn.checkInTime} (UTC) for employee ${userId}`);
      
      return res.status(200).json({ status:true, message: 'Check-in successful', data: checkIn });
    } catch (err) {
      console.error('Error starting work:', err);
      return res.status(500).json({ error: 'Error starting work' });
    }
};
// Check Out
exports.checkOut = async (req, res) => {
  const { userId,checkOutTime,  timeZone,checkDate,  } = req.body;
  console.log(userId);
  console.log(checkOutTime);
  console.log(timeZone);
  console.log(checkDate);

  try {
    let employeeObjectId = new mongoose.Types.ObjectId(userId);

    // Convert the checkDate and timeZone to a UTC date (start of the day in the given time zone)
    const StartOfDay = `${checkDate} 00:00`;
    const EndOfDay = `${checkDate} 23:59`;
    console.log(StartOfDay+" "+EndOfDay);
    // Find the document based on employeeId and checkDate within that day
    console.log(userId);
    const utccheckDate = moment.utc(checkDate).toDate();
    console.log(utccheckDate)
    const result = await CheckInOut.findOneAndUpdate(
      {
        employeeId: employeeObjectId, // employeeObjectId,
        checkDate: utccheckDate //{ $gte: StartOfDay, $lte: EndOfDay } // Match within the same day
      },
      { $set: { checkOutTime: checkOutTime } },  // Update the checkOutTime to the passed time
      { new: true } // Return the updated document
    );
    console.log(result);
    if (result) {
      console.log(`Work ended for employee ${userId} at ${checkOutTime} (UTC)`);
      return res.status(200).json({ status:true,  message: 'Check-out successful', data: result });
    } else {
      return res.status(404).json({ error: 'Check-in record not found for the specified employee' });
    }

  } catch (err) {
    console.error('Error ending work:', err);
    return res.status(500).json({ error: 'Error ending work' });
  }
};
//update
exports.update = async (req, res) => {
  const { _id,
    checkDate,
    checkInTime,
    checkOutTime  } = req.body;
  

  try {
    console.log("Body: ",req.body)
    let objectId = new mongoose.Types.ObjectId(_id);

    // Find the document based on employeeId and checkDate within that day
    console.log("Id is: ",_id);
    const utccheckDate = moment.utc(checkDate).toDate();
    console.log(utccheckDate)
    const result = await CheckInOut.findOneAndUpdate(
      {
        _id: objectId,
      },
      { $set: { checkInTime:checkTimeFormat12(checkInTime) ,checkOutTime: checkTimeFormat12(checkOutTime),checkDate: utccheckDate } },  // Update the checkOutTime to the passed time
      { new: true } // Return the updated document
    );
    console.log(result);
    if (result) {
      console.log(`OK`);
      return res.status(200).json({ status:true,  message: 'Updated successful', data: result });
    } else {
      return res.status(404).json({ error: 'Check-in record not found for the specified employee' });
    }

  } catch (err) {
    console.error('Error ending work:', err);
    return res.status(500).json({ error: 'Error ending work' });
  }
};
// Get All history
exports.getAllHistory = async(req , res)  =>  {

      const {employeeId} = req.body;
      const tempA = await CheckInOut.find( {employeeId} );
      console.log(tempA);
    
      res.status(200).json({ message: 'successfully' , tempA });
};
// Monthly History
exports.getMonthlyHistory = async (req, res) => {
   // api to retern history of this month 
  const { employeeId } = req.body;
  
  console.log("Id "+ employeeId);

  try {
    let employeeObjectId = new mongoose.Types.ObjectId(employeeId);
    // Get the current date and calculate the start and end of the month
    console.log("Id obj "+ employeeObjectId);
    const now = moment.tz('Asia/Damascus'); // Current time in the employee's local time zone
    const startOfMonth = now.clone().startOf('month').toDate(); // Start of month in UTC
    const endOfMonth = now.clone().endOf('month').toDate();     // End of month in UTC
    console.log(startOfMonth);
    console.log(endOfMonth);
    // Find records for the employee within the current month (in UTC)
     tempA = await CheckInOut.find({
      employeeId: employeeObjectId,
      checkDate: { $gte: startOfMonth, $lte: endOfMonth }
    });
     // Convert the check-in and check-out times from UTC to local time zone
    // const convertedRecords = tempA.map(record => ({
    //   ...record.toObject(), // Convert the Mongoose document to a plain JS object
    //   checkInTime: moment.utc(record.checkInTime).tz(timeZone).format('YYYY-MM-DD HH:mm:ss'), // Convert to local time
    //   checkOutTime: record.checkOutTime ? moment.utc(record.checkOutTime).tz(timeZone).format('YYYY-MM-DD HH:mm:ss') : null, // Convert if exists
    // }));

    // Respond with the filtered and converted records
    res.status(200).json({ message: 'successfully',  tempA });

  } catch (err) {
    console.error('Error fetching history:', err);
    res.status(500).json({ error: 'Error fetching history' });
  }
};
// Monthly History
async function fetchMonthlyHistory(employeeId, month)  {
  console.log("get in fetch monyjly history")
  let date = moment(month);
  const startDate = date.startOf('month').toDate(); // Start of month in UTC
  const endDate = date.endOf('month').toDate();     // End of month in UTC
  
  try {
    let employeeObjectId = new mongoose.Types.ObjectId(employeeId);
    const historyData = await CheckInOut.find({
      employeeId: employeeObjectId,
      checkDate: { $gte: startDate, $lte: endDate }
    });

    if (!Array.isArray(historyData)) {
      throw new Error("Expected historyData to be an array, but got a different type");
    }

    // Sort if historyData is indeed an array
    const sortedHistory = historyData.sort((a, b) => new Date(b.checkDate) - new Date(a.checkDate));

    return { success: true, data: sortedHistory };
  } catch (error) {
    console.error('Error fetching monthly history:', error);
    return { success: false, error: 'Error fetching monthly history' };
  }
}
exports.getMonthlyHistoryMonth = async (req, res) => {
  const { employeeId, month } = req.body;
  
  const historyResponse = await fetchMonthlyHistory(employeeId, month);

  if (historyResponse.success) {
    res.status(200).json({ message: 'successfully', data: historyResponse.data });
  } else {
    res.status(500).json({ error: historyResponse.error });
  }
};
// Last Month History
exports.getLastMonthlyHistory = async (req, res) => {
  const { employeeId, timeZone } = req.body;

  try {
    // Get the current date and calculate the start and end of the previous month
    const now = moment.tz(timeZone); // Current time in the employee's local time zone
    const startOfLastMonth = now.clone().subtract(1, 'month').startOf('month').toDate(); // Start of last month in UTC
    const endOfLastMonth = now.clone().subtract(1, 'month').endOf('month').toDate();     // End of last month in UTC
    // Find records for the employee within the last month (in UTC)
    const tempA = await CheckInOut.find({
      employeeId: new mongoose.Types.ObjectId(employeeId),
      checkDate: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    });

    // Respond with the filtered and converted records
    res.status(200).json({ message: 'successfully',  tempA });

  } catch (err) {
    console.error('Error fetching history:', err);
    res.status(500).json({ error: 'Error fetching history' });
  }
}; 
// Total Hours
exports.getTotalHours = async (req, res) => {
    const employeeId  = req.body['userId'];
    const month = req.body['month'];

    total = await calculateTotalHours(employeeId,month);
    res.status(200).json({ status: true, success: "sendData", total: total });
};
exports.getTotalLateHours = async (req, res) => {
  const employeeId  = req.body['userId'];
  const month = getMonthNumber(req.body['month']);
  const year = req.body['year'];
  [totalExtraHours,totalLateHours] = await calculateTotalLateHours(employeeId,month,year);
  res.status(200).json({ status: true, success: "sendData", totalExtr: totalExtraHours,totalLate:totalLateHours });
};
//Time Shift
exports.timeShift = async (req, res) => {
  const employeeId  = req.body['userId'];
  const month = getMonthNumber(req.body['month']);
  const year = req.body['year'];
  const start = req.body['startTime'];
  const end = req.body['endTime'];
  const data = await calculateTimeShift(employeeId,month,year,start,end);
  res.status(200).json({ status: true, success: "sendData", data });
};

// Current Check
exports.currentCheck = async(req, res)=> {
  const {userId, date}=req.body;
  const utccheckDate = moment.utc(date).toDate();
  try {
    check = await CheckInOut.findOne({
      employeeId:userId,
      checkDate:utccheckDate
    });
    checkTime = {
      "checkIn":check['checkInTime'],
      "checkOut":check['checkOutTime'],
    }
    res.status(200).json({ message: 'successfully',  checkTime });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching history' });
  }
  };

//summry data
const calculateAttendanceMetrics = async (employeeId, dateString, shiftStart, shiftEnd) => {

  const date = moment(new Date(dateString));

  // Start and end of the month
  const startDate = date.startOf('month').format("YYYY-MM-DD");
  const endDate = date.clone().add(1, 'month').startOf('month').format("YYYY-MM-DD"); 

  try {
    console.log(startDate,endDate)
      const sessions = await CheckInOut.find({
          employeeId: new mongoose.Types.ObjectId(employeeId),
          checkDate: { $gte: startDate, $lt: endDate },
      });
      const leaves = await Leave.find({
        employeeId,
        status: 'Approved', // Only include approved leave requests
        startDate:{ $gte: startDate, $lt: endDate },
      })
      
        // Initialize counters for paid and unpaid leave days
        let totalPaidLeaveDays = 0;
        let totalUnpaidLeaveDays = 0;

        // Calculate the count of days for each leave request and accumulate totals
        leaves.map(leave => {
            const leaveStartDate = moment(leave.startDate);
            const leaveEndDate = moment(leave.endDate);
            const durationInDays = leaveEndDate.diff(leaveStartDate, 'days') + 1; // Include both start and end dates

            // Accumulate total days based on leave type
            if (leave.type === 'Paid') {
                totalPaidLeaveDays += durationInDays;
            } else if (leave.type === 'Unpaid') {
                totalUnpaidLeaveDays += durationInDays;
            }
            
        });

      let totalMinutes = 0;
      let lateMinutes = 0;
      let earlyLeaveMinutes = 0;
      let earlyArrivalMinutes = 0;
      let extraAttendanceMinutes = 0;

      sessions.forEach(entry => {
        
          if (entry.checkOutTime == null) {
              return;
          } else {
              const checkInTime = moment(convertTo24HourFormat(entry.checkInTime), 'HH:mm');
              const checkOutTime = moment(convertTo24HourFormat(entry.checkOutTime), 'HH:mm');

              const shiftStartTime = moment(shiftStart, 'HH:mm');
              const shiftEndTime = moment(shiftEnd, 'HH:mm');

              // Calculate total minutes worked
              totalMinutes += Math.abs(checkOutTime.diff(checkInTime, 'minutes'));

              // Calculate late arrival and early arrival
              if (checkInTime.isAfter(shiftStartTime)) {
                  lateMinutes += checkInTime.diff(shiftStartTime, 'minutes');
              } else {
                  earlyArrivalMinutes += shiftStartTime.diff(checkInTime, 'minutes');
              }

              // Calculate early leave and extra attendance
              if (checkOutTime.isBefore(shiftEndTime)) {
                  earlyLeaveMinutes += shiftEndTime.diff(checkOutTime, 'minutes');
              } else {
                  extraAttendanceMinutes += checkOutTime.diff(shiftEndTime, 'minutes');
              }
          }
      });

      const totalHours = (totalMinutes / 60).toFixed(2);
      const totalLateHours = (lateMinutes / 60).toFixed(2);
      const totalEarlyLeaveHours = (earlyLeaveMinutes / 60).toFixed(2);
      const totalEarlyArrivalHours = (earlyArrivalMinutes / 60).toFixed(2);
      const totalExtraAttendanceHours = (extraAttendanceMinutes / 60).toFixed(2);

     
      return {
          totalHours,
          lateHours: totalLateHours,
          earlyLeaveHours: totalEarlyLeaveHours,
          earlyArrivalHours: totalEarlyArrivalHours,
          extraAttendanceHours: totalExtraAttendanceHours,
          totalPaidLeaveDays,
          totalUnpaidLeaveDays
      };
  } catch (err) {
      console.error('Error calculating attendance metrics:', err);
  }
};

exports.summry = async (req, res) => {
  const { employeeId, date } = req.body;

  try {
    // Use fetchShifts directly to get the shift data
    const shiftResponse = await fetchShifts(employeeId);

    // Check if shifts were successfully fetched and are available
    if (!shiftResponse.success || !shiftResponse.shifts || shiftResponse.shifts.length === 0) {
      return res.status(404).json({ message: 'No shifts found for the employee' });
    }

    const { startTime: shiftStart, endTime: shiftEnd } = shiftResponse.shifts[0];
    console.log("p ",shiftStart)
    console.log("p1 ",shiftEnd)
    // Fetch attendance data
    const attendanceData = await calculateAttendanceMetrics(employeeId, date, shiftStart, shiftEnd);
    console.log("a ",attendanceData)
    // Fetch check-in and check-out history
    const historyResponse = await fetchMonthlyHistory(employeeId, date);
    console.log(historyResponse)
    
    if (historyResponse === null) {
      return res.json({ message: historyResponse.error || 'Error fetching history data' });
    }
    // Sort the history data by date
    const sortedHistoryData = historyResponse.data.sort((a, b) => 
      new Date(a.checkDate) - new Date(b.checkDate)
    );

    // Combine data as needed
    const combinedData = {
      summary: {
        ...attendanceData,
        totalDays: sortedHistoryData.length
      },
      details: sortedHistoryData.map(entry => ({
        date: entry.checkDate,
        checkIn: entry.checkInTime,
        checkOut: entry.checkOutTime,
        // You can calculate daily hours here if needed
        dailyHours: calculateDailyHours(entry.checkInTime, entry.checkOutTime)
      }))
    };

    res.json(combinedData);
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ 
      message: 'Error fetching monthly summary data', 
      error: error.message || 'Unknown error',
      stack: error.stack
    });
  }
};

function calculateShiftDaysInMonth(month, shift) {
  const [monthName, year] = month.split(' ');
  const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  let shiftDays = [];

  for (let day = 1; day <= daysInMonth; day++) {
    // const date = new Date(Date.UTC(2024, 8, 1));
    const date = new Date(Date.UTC(year, monthIndex, day));
    const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' });
    if (shift.days.includes(dayOfWeek)) {

      shiftDays.push(date);
    }
  }

  return shiftDays;
}
// GET /api/attendance/monthly/:employeeId
exports.summryLastTwoMonth = async (req, res) => {
  try {
    const { employeeId } = req.params;
    
    let monthlyAttendance = {};

    // Fetch all shifts associated with the employee
    const shifts = await Shift.find({ employees: employeeId });
    console.log(shifts)
    // Calculate last Two months dynamically
    const lastTwoMonths = Array.from({ length: 2 }, (_, i) => 
      moment().subtract(i + 1, 'months').format('MMMM YYYY')
  ).reverse();

    for (const shift of shifts) {
      for (const month of lastTwoMonths) {
        // Initialize monthly summary if not yet created
        if (!monthlyAttendance[month]) {
          monthlyAttendance[month] = {
            totalAttendance: 0,
            absences: 0,
            tardies: 0,
          };
        }

        // Calculate the days of the month that align with the shift schedule
        const shiftDaysInMonth = calculateShiftDaysInMonth(month, shift);
        
        for (const day of shiftDaysInMonth) {
          // Find a check-in for the specific day
          const checkInRecord = await CheckInOut.findOne({
            employeeId,
            checkDate: day,
          });
          
          if (checkInRecord) {

            const shiftStartTime = shift.startTime
            const checkInTime =  convertTo24HourFormat(checkInRecord.checkInTime) 
            
            
            const checkInT = moment(checkInTime, 'HH:mm');
            const checkSInT = moment(shiftStartTime, 'HH:mm');
            
            // Calculate tardies
            if (checkInT.diff(checkSInT, 'minutes') > 5 ) {
              monthlyAttendance[month].tardies++;
            } else {
              monthlyAttendance[month].totalAttendance++;
            }
          } else {
            monthlyAttendance[month].absences++;
          }
        }
      }
    }

    res.json({
      employeeId,
      monthlyAttendance
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching monthly attendance data' });
  }
};
// Helper function to format time
function formatTime(time) {
  if (!time) return 'N/A';
  const date = new Date(time);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}
exports.summry2 = async (req, res) => {
  const { employeeId, date } = req.body;
  const dateMoment = moment(new Date(date));
  
  try {
    // Use fetchShifts directly to get the shift data
    const shiftResponse = await fetchShifts(employeeId);

    // Check if shifts were successfully fetched and are available
    if (!shiftResponse.success || !shiftResponse.shifts || shiftResponse.shifts.length === 0) {
      return res.status(404).json({ message: 'No shifts found for the employee' });
    }
    console.log(shiftResponse.shifts[0].days);
    const { startTime: shiftStart, endTime: shiftEnd } = shiftResponse.shifts[0];
    const shiftDays = shiftResponse.shifts[0].days;
    // Fetch attendance data
    console.log(shiftDays)
    const attendanceData = await calculateAttendanceMetrics(employeeId, date, shiftStart, shiftEnd);
    console.log("Attendance Data: ", attendanceData);

    // Fetch check-in and check-out history
    const historyResponse = await fetchMonthlyHistory(employeeId, date);
       
    if (!historyResponse || !historyResponse.data) {
      return res.json({ message: historyResponse?.error || 'Error fetching history data' });
    }

    // Sort the history data by date
    const sortedHistoryData = historyResponse.data.sort((a, b) => 
      new Date(a.checkDate) - new Date(b.checkDate)
    );

    // Fetch leave data for the employee in the specified month
    let leaveRecords = await fetchEmployeeLeavesForMonth(employeeId, date);
    console.log("Leave Records 1: ", leaveRecords);
    // Ensure leaveRecords is an array
    if (!Array.isArray(leaveRecords.leaves)) {
      leaveRecords = []; // Default to an empty array if not valid
    }


    // Create a list of all days in the month
    const allDaysInMonth = [];
    let currentDate = new Date(dateMoment.startOf('month').add(1, 'day'));
    const dayOfday = new Date()
    console.log("dayOfday: ",dayOfday)
    const endDayOfday = new Date(dateMoment.endOf('month').add(1, 'day'));
    const endOfMonth = new Date(dateMoment.endOf('month').add(1, 'day'));
    if(endOfMonth == endDayOfday){
      while (currentDate <= endOfMonth) {
        allDaysInMonth.push({
          date: currentDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
          checkIn: null,
          checkOut: null,
          type: 'Abesent' // Default type to Shift
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }else {
      while (currentDate <= dayOfday) {
        allDaysInMonth.push({
          date: currentDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
          checkIn: null,
          checkOut: null,
          type: 'Abesent' // Default type to Shift
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    // Combine attendance and leave records into allDaysInMonth
    sortedHistoryData.forEach(entry => {
      // Ensure checkDate is in the correct format
      const formattedDate = new Date(entry.checkDate).toISOString().split('T')[0];
      const recordIndex = allDaysInMonth.findIndex(day => day.date === formattedDate);
      if (recordIndex !== -1) {
        allDaysInMonth[recordIndex].checkIn = entry.checkInTime;
        allDaysInMonth[recordIndex].checkOut = entry.checkOutTime;
        allDaysInMonth[recordIndex].type = 'Attendance';
      }
    });
    console.log(leaveRecords.leaves)
    leaveRecords.leaves.forEach(leave => {
      const formattedLeaveDate = new Date(leave.startDate).toISOString().split('T')[0];
      const recordIndex = allDaysInMonth.findIndex(day => day.date === formattedLeaveDate);
      if (recordIndex !== -1) {
        allDaysInMonth[recordIndex].type = 'Leave';
      }
    });

    // Combine data as needed
    const combinedData = {
      summary: {
        ...attendanceData,
        totalDays: sortedHistoryData.length,
        totalLeaves: leaveRecords.length,
      },
      details: allDaysInMonth.map(day => {
        const dateObj = new Date(day.date);
        const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'long' }); // Get short day name (e.g., Sun, Mon)
        // Mapping of short day names to long day names
        console.log("day off week:  ",dayOfWeek)
        const dayMapping = {
          Sun: 'Sunday',
          Mon: 'Monday',
          Tue: 'Tuesday',
          Wed: 'Wednesday',
          Thu: 'Thursday',
          Fri: 'Friday',
          Sat: 'Saturday'
        };
        const dayMapping2 = {
          'Sunday': 'Sun',
          'Monday': 'Mon',
          'Tuesday': 'Tue',
          'Wednesday': 'Wed',
          'Thursday': 'Thu',
          'Friday': 'Fri',
          'Saturday': 'Sat'
        };

        // Convert short day name to long form
        const shortDay = dayMapping2[dayOfWeek];
        // Check if the day is a shift day
        console.log(shiftDays.includes(dayOfWeek.toString()))
        console.log(day.checkIn)
        if (shiftDays.includes(dayOfWeek.toString()) && day.type === 'Attendance') {
          // Format check-in and check-out times
          const formattedCheckIn = day.checkIn ? day.checkIn  : 'N/A';
          const formattedCheckOut = day.checkOut ? day.checkOut : 'N/A';
          const dailyHours = calculateDailyHours(day.checkIn, day.checkOut); // Ensure hours are formatted to 2 decimal places
      
          return {
            date: day.date,
            dayOfWeek: shortDay,
            checkIn: formattedCheckIn,
            checkOut: formattedCheckOut,
            dailyHours: dailyHours, // Ensure hours are formatted to 2 decimal places
            type: 'Attendance'
          };
        } else if (day.type === 'Leave') {
          // If it's a leave day, return relevant information
          return {
            date: day.date,
            dayOfWeek: shortDay,
            type: 'Leave'
          };
        } else if (!shiftDays.includes(dayOfWeek)) {
          // If it's a weekend or non-shift day
          return {
            date: day.date,
            dayOfWeek: shortDay,
            type: 'Weekend'
          };
        } else {
          // If absent
          return {
            date: day.date,
            dayOfWeek: shortDay,
            type: 'Absent'
          };
        }
      })
    };

    res.json(combinedData);
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ 
      message: 'Error fetching monthly summary data', 
      error: error.message || 'Unknown error',
      stack: error.stack
    });
  }
};
