const express = require("express");
const moment = require('moment');
const router = express.Router();
const { CheckInOut } = require("../models/schmeaESS");
const mongoose = require('mongoose');
const UserModel = require("../models/user.model");
const { ObjectId } = require('mongodb');

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
  const stopWork = async (employeeId) => {
    try {
      
      
      const { time, date } = getCurrentTime();

      check = await CheckInOut.findOneAndUpdate(
        { employee: employeeId, checkDate: date,checkOutTime: "null" },
        { checkOutTime: time },
      );

      const record = await CheckInOut.findOne({
        employee: employeeId,
        checkDate: date,
        checkOutTime: time
      });
      
      console.log(record);
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
      console.log(year);
      console.log(month);
      
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
      
      console.log(startDate);
      console.log(endDate);
      
      try {
          console.log("I'm in Hours :" + employeeId);
          const sessions = await CheckInOut.find({
              employeeId: employeeId,
              checkDate: { $gte: startDate, $lt: endDate },
          });
      
          console.log(sessions);
          let totalMinutes = 0;
          let checkOutTime;
          let checkInTime;
          sessions.forEach(entry => {
            if(moment(entry.checkOutTime, 'HH:mm')== null){
              
              return;
                
              }else{
                 checkInTime = moment(entry.checkInTime, 'HH:mm');
                console.log(checkInTime);

                checkOutTime = moment(entry.checkOutTime, 'HH:mm');
                console.log(checkOutTime);
                console.log("-------------------");
                console.log(Math.abs(checkOutTime.diff(checkInTime, 'minutes')));
              }
              
              
              totalMinutes += Math.abs(checkOutTime.diff(checkInTime, 'minutes'));
              
          });
          
         
          const totalHours = (totalMinutes / 60).toFixed(2);
          console.log(`Total Hours worked by employee ${employeeId} in month: ${totalHours}`);
          return { totalHours, totalMinutes };
      } catch (err) {
          console.error('Error calculating total hours:', err);
      }
  };
  
  


  // Express routes
  router.post('/api/start-work', async (req, res) => {
    
    const { userId } = req.body;
    
    checkIn = await startWork(userId);
    
    res.status(200).json({ status: true, success: "sendData", checkIn: checkIn });
  });
  
  router.post('/api/stop-work', async (req, res) => {
    const { employeeId} = req.body;
    const checkOut = await stopWork(employeeId);
    res.status(200).json({ status: true, success: "sendData1", checkOut: checkOut });
  });
  
  router.post('/api/calculate-hours', async (req, res) => {
    console.log("Here now with requset : "+req.body['userId'])
    const employeeId  = req.body['userId'];
    const month = getMonthNumber(req.body['month']);
    const year = req.body['year'];
    console.log(year)
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


    module.exports = router;