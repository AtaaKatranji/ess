const express = require("express");
const { Employee } = require("./models/schmeaESS");


require("./config/db")
const cors = require('cors');
const app = express();
// Enable CORS for specific origin
app.use(cors({
  origin: ['http://localhost:3000','https://ess-admin-lime.vercel.app/'], // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Specify allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
}));

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

