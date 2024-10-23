const express = require("express");
const { Employee } = require("./models/schmeaESS");


require("./config/db")
const cors = require('cors');
const app = express();
// Enable CORS for specific origin
app.use(cors({
  origin: 'https://ess-admin-lime.vercel.app', // Your frontend's origin
  credentials: true, // This allows credentials (like cookies) to be sent
  allowedHeaders: ['Content-Type'], // Allow the necessary headers
  methods: ['GET', 'POST', 'OPTIONS'], // Allowed methods
}));

// Handle preflight requests (OPTIONS method)
app.options('*', cors()); 

app.use(express.json());
app.use(express.urlencoded({extended : true}));

const dotenv = require('dotenv');

const admins = require('./routes/adminRoutes')
const userRoutes = require('./routes/user');
// const checksRoutes = require('./routes/apis');
const checksRoutes = require('./routes/checkInOutRoutes');
const test = require("./routes/user.routes");
const todo = require("./routes/toDo_apis");
const institutionRoutes = require('./routes/institutionRoutes');
const errorHandler = require('./middleware/errorHandler');

app.use('/adm/admins', admins);
app.use('/api',test);
app.use('/users', userRoutes);
app.use('/checks', checksRoutes);
app.use('/todolist', todo);
app.use('/ins', institutionRoutes);

// Error handler (must come after all routes)
//app.use(errorHandler);

const port = process.env.PORT || 9000;

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
