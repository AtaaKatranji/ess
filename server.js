const express = require("express");
// const http = require('http');
// const socketIo = require('socket.io');
require("./config/db")
const cors = require('cors');
const app = express();
// const {pusher} = require('./webpush.config')
// CORS options to allow all necessary headers and credentials
const corsOptions = {
  origin: 'https://ess-admin-lime.vercel.app', // Allow only your frontend domain
  credentials: true, // Allow cookies and credentials
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow Content-Type and Authorization headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow these HTTP methods
};
// apply the CORS middleware globally for all routes
app.use(cors(corsOptions));
// Handle preflight requests (OPTIONS)
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended : true}));
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');// Use the cookieParser middleware
app.use(cookieParser());
const port = process.env.PORT || 9000;
// const server = http.createServer(app);
// const io = socketIo(server, {
//   cors: {
//     origin: '*', // Allow requests from any origin
//     methods: ['GET', 'POST']
//   }
// });
// // Listen for WebSocket connections
// io.on('connection', (socket) => {
//   console.log('A user connected');

//   socket.on('disconnect', () => {
//     console.log('A user disconnected');
//   });
// });

// module.exports = { io };



const admins = require('./routes/adminRoutes')
const userRoutes = require('./routes/user');
// const checksRoutes = require('./routes/apis');
const checksRoutes = require('./routes/checkInOutRoutes');
const test = require("./routes/user.routes");
const todo = require("./routes/toDo_apis");
const institutionRoutes = require('./routes/institutionRoutes');
const overView = require('./routes/overViewRoutes');
const shiftRoute = require("./routes/shiftRoutes");
const leavesRoute = require("./routes/leavesRoutes");
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const errorHandler = require('./middleware/errorHandler');

app.use('/adm/admins', admins);
app.use('/attendance', overView);
app.use('/api',test);
app.use('/users', userRoutes);
app.use('/checks', checksRoutes);
app.use('/todolist', todo);
app.use('/ins', institutionRoutes);
app.use('/shift', shiftRoute);
app.use('/leaves', leavesRoute);
app.use('/Noti', subscriptionRoutes);


app.listen(port,process.env.SERVER_IP, () => {
  console.log(`Server running at  ${port}/`);
});

app.get("/",(req, res)=>{
  res.send("Hello in 9000")
});
app.get("/ins",(req, res)=>{
  res.send("Hello in ins 9000")
});
app.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://ess-admin-lime.vercel.app');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.sendStatus(200); // Send a success status for the preflight request
});
// pusher.trigger("my-channel", "my-event", {
//   message: "hello world"
// });