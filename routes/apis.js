const express = require("express");
const moment = require('moment-timezone'); 
const router = express.Router();
const { CheckInOut } = require("../models/schmeaESS");
const mongoose = require('mongoose');
const UserModel = require("../models/user.model");
const { ObjectId } = require('mongodb');

const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

// Include this in your request body
// const response = await fetch('/api/start-work', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ userId, timeZone: userTimeZone }),
// });
//get month number 
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
//get time
const getCurrentTime = () => {
  const now = new Date();
  
  // Format the date
  const date = now.toISOString().slice(0, 10);
  console.log("date in fetCurrentTime : "+date);
  
  // Format the time
  let hours = now.getHours();
  let minutes = now.getMinutes();
  
  // Handle AM/PM
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // The hour '0' should be '12'
  
  // Pad minutes with leading zero if needed
  minutes = minutes < 10 ? '0' + minutes : minutes;
  
  const time = `${hours}:${minutes} ${ampm}`;
  
  console.log(time);
  return { "time" : time, "date" : date };
};
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
//get current user
const getCurrentUser = async (employeeId, date) => {

  return  await CheckInOut.find({ employee: employeeId, checkDate: date })
   
}
// Start Work
const startWork = async (employeeIdStr) => {
    try {
      let employeeId = new mongoose.Types.ObjectId(employeeIdStr);
      const {time , date} = getCurrentTime();
      const checkIn = new CheckInOut({ 
        "checkInTime": time,
        "checkDate": date, 
        "employeeId": employeeId,
        "checkOutTime" : "null"
     });
      await checkIn.save();
      console.log(`Work started at ${date}:${checkIn.checkInTime} for employee ${employeeId}`);
      return checkIn;
  
      
    } catch (err) {
      console.error('Error starting work:', err);
    }
  };
  
  // Stop Work
  const stopWork = async (employeeId, time, date) => {
    try {
      
      
      //const { time, date } = getCurrentTime();

      check = await CheckInOut.findOneAndUpdate(
        { employee: employeeId, checkDate: date,checkOutTime: "null" },
        { checkOutTime: time},
      );
      console.log("check: "+check);

      const record = await CheckInOut.findOne({
        employee: employeeId,
        checkDate: date,
        checkOutTime: time
      });
      
      console.log("record: "+record);
      if (record) {
        console.log(`Work stopped at ${date}:${record.checkOutTime} for employee ${record['employeeId']}`);
        return record.checkOutTime;
      } else {
        console.log(`No active work session found for employee ${employeeId}`);
        return null;
      }
    } catch (err) {
      console.error('Error stopping work:', err);
      return null;
    }
  };
  
  // Calculate Total Hours
  const calculateTotalHours = async (employeeId, month, year) => {
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
          console.log(sessions);
          let totalMinutes = 0;
          let checkOutTime;
          let checkInTime;
          let checkOutT;

          sessions.forEach(entry => {
            if( entry.checkOutTime == null){
              return;
              }else{
                checkInTime = moment(entry.checkInTime, 'HH:mm');
                checkOutT= convertTo24HourFormat(entry.checkOutTime);
                checkOutTime = moment(checkOutT, 'HH:mm');
              }
              totalMinutes += Math.abs(checkOutTime.diff(checkInTime, 'minutes'));
          });
          const totalHours = (totalMinutes / 60).toFixed(2);
          console.log(`Total Hours worked by employee ${employeeId} in month:${month} ${totalHours}`);
          return { totalHours, totalMinutes };
      } catch (err) {
          console.error('Error calculating total hours:', err);
      }
  };
  
  



 // Start Work API
 router.post('/startWork1', async (req, res) => {
  const { employeeId, checkInTime, checkDate, timeZone } = req.body;

  try {
    let employeeObjectId = new mongoose.Types.ObjectId(employeeId);
    
    const checkIn = new CheckInOut({
      checkInTime: checkInTime, // Time passed from the Flutter frontend
      checkDate: checkDate, // Date passed from the Flutter frontend
      employeeId: employeeObjectId,
      checkOutTime: null,
      timeZone: timeZone // Store the time zone for potential later use
    });

    await checkIn.save();
    console.log(checkIn);
    console.log(`Work started at ${checkDate}:${checkIn.checkInTime} for employee ${employeeId}`);
    
    return res.status(200).json({ message: 'Check-in successful', data: checkIn });
  } catch (err) {
    console.error('Error starting work:', err);
    return res.status(500).json({ error: 'Error starting work' });
  }
});
// Start work 
// Define the route for starting work (check-in)
router.post('/startWork', async (req, res) => {
  console.log(req.body);
  const { userId, checkInTime, timeZone, checkDate } = req.body;
  //const employeeId = req.body.userId.value;
  //console.log(userId);
  // console.log(userId);
  // console.log(checkInTime);
  // console.log(timeZone);
  // console.log(checkDate);

  try {
    let employeeObjectId = new mongoose.Types.ObjectId(userId);
    
    // Combine checkDate and checkInTime into a single datetime string
    // const localDateTime = `${checkDate}`;
    // console.log("local: "+localDateTime);
    // Convert the local datetime and timezone to UTC using moment-timezone
    //const utcDateTime = moment.tz(localDateTime, timeZone).toDate();
    //console.log("utc: "+utcDateTime);
    const checkIn = new CheckInOut({
      checkInTime: checkInTime, // The converted UTC datetime
      checkDate: checkDate, // Optionally, you can store the UTC date here as well
      employeeId: userId,
      checkOutTime: null,
      timeZone: timeZone // Still store the original timezone for future reference
    });

    await checkIn.save();
    console.log(checkIn);
    console.log(`Work started at ${checkIn.checkInTime} (UTC) for employee ${userId}`);
    
    return res.status(200).json({ status:true, message: 'Check-in successful', data: checkIn });
  } catch (err) {
    console.error('Error starting work:', err);
    return res.status(500).json({ error: 'Error starting work' });
  }
});
  // End Work 1
  router.post('/api/stop-work', async (req, res) => {
    const { employeeId, time, checkDate} = req.body;
    console.log(employeeId+" //// "+time+" //// "+checkDate);
    const checkOut = await stopWork(employeeId, time, checkDate);
    res.status(200).json({ status: true, success: "sendData1", checkOut: checkOut });
  });
   // End Work 2 
  // Define the route for ending work (check-out)
router.post('/stopWork', async (req, res) => {
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
    // Convert the local check-out time to UTC
    // const localOutDateTime = `${checkDate} ${checkOutTime}`;
    // console.log("local: "+localOutDateTime);
    // const utcCheckOutTime = moment.tz(localOutDateTime, timeZone).toDate();
    // console.log("utc: "+utcCheckOutTime);
    
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
});
  router.post('/api/calculate-hours', async (req, res) => {
    
    const employeeId  = req.body['userId'];
    const month = getMonthNumber(req.body['month']);
    const year = req.body['year'];
    total = await calculateTotalHours(employeeId,month,year);
    res.status(200).json({ status: true, success: "sendData", total: total });
   
  });

  router.get("/api/welcome/hello-world", (req, res) => {
    res.json({
      message: "Hello, World!",
    });
});
  router.post("/api/history", async(req , res)  =>  {

    const {employeeId} = req.body;
    const tempA = await CheckInOut.find( {employeeId} );
    console.log(tempA);
  
    res.status(200).json({ message: 'successfully' , tempA });
  })
// api to retern history of this month 
router.post("/monthlyHistory", async(req, res) => {
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
});
// last Month
router.post("/lastmonthlyHistory", async (req, res) => {
  const { employeeId, timeZone } = req.body;

  try {
    // Get the current date and calculate the start and end of the previous month
    const now = moment.tz(timeZone); // Current time in the employee's local time zone
    const startOfLastMonth = now.clone().subtract(1, 'month').startOf('month').toDate(); // Start of last month in UTC
    const endOfLastMonth = now.clone().subtract(1, 'month').endOf('month').toDate();     // End of last month in UTC

    console.log(startOfLastMonth);
    console.log(endOfLastMonth);

    // Find records for the employee within the last month (in UTC)
    const tempA = await CheckInOut.find({
      employeeId: new mongoose.Types.ObjectId(employeeId),
      checkDate: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    });

    // // Convert the check-in and check-out times from UTC to local time zone
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
});
// Current Check
router.post("/api/checkcurrentday", async(req, res)=> {
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
  });

    module.exports = router;