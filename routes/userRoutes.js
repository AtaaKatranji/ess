// const router = express.Router();
// const User = require("../models/employee");

// router.post("/register", async (req, res) => {
//     try {
//       const { name, email, password, roles } = req.body;
//       const user = new User({ name, email, password, roles });
//       await user.save();
//       res.status(201).json({ message: "User registered successfully" });
//     } catch (err) {
//       res.status(400).json({ message: err.message });
//     }
//   });
  
//   router.post("/login", async (req, res) => {
//     try {
//       const { email, password } = req.body;
//       const user = await User.findOne({ email });
//       if (!user || !(await user.comparePassword(password))) {
//         return res.status(401).json({ message: "Invalid email or password" });
//       }
//       const token = await user.generateToken();
//       res.json({ token });
//     } catch (err) {
//       res.status(400).json({ message: err.message });
//     }
//   });
//   module.exports = router;
  // routes/leaveRoutes.js
const express = require('express');
const Leave = require('../models/leaves');
const { io } = require('../server'); // Import the `io` instance from your server

const router = express.Router();

router.post('/leave', async (req, res) => {
  try {
    const { employeeId, startDate, endDate, type, reason } = req.body;

    // Create a new leave request
    const leaveRequest = new Leave({
      employeeId,
      startDate,
      endDate,
      type,
      reason,
    });

    await leaveRequest.save();
    
    // Emit the new leave request event to all connected clients
    io.emit('newLeaveRequest', leaveRequest);
    
    res.status(201).json({ message: 'Leave request submitted successfully', leaveRequest });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting leave request', error: error.message });
  }
});

module.exports = router;