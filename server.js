const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const { sendNotification } = require('./utils/sendNotification');
const errorHandler = require('./middleware/errorHandler');


// Load environment variables
require('dotenv').config();
//dotenv.config();

// Initialize Express app and HTTP server
const app = express();
// const server = http.createServer(app);

// // Initialize WebSocket server
// const wss = new WebSocket.Server({ server });
// // Middleware to attach wss to the req object
// app.use((req, res, next) => {
//   req.wss = wss; // Attach wss to the request object
//   next();
// });
// Database connection
require('./config/db');
app.use(express.static('config'));

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://10.2.0.2:3000',
  'https://ess-admin-lime.vercel.app'
  // Add production frontend URL here
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
const routes = [
  { path: '/adm/admins', router: require('./routes/admin.routes') },
  { path: '/attendance', router: require('./routes/overView.routes') },
  { path: '/api', router: require('./routes/user.routes') },
  //{ path: '/users', router: require('./routes/user') },
  { path: '/checks', router: require('./routes/checkInOut.routes') },
  { path: '/todolist', router: require('./routes/toDo_apis.routes') },
  { path: '/ins', router: require('./routes/institution.routes') },
  { path: '/shift', router: require('./routes/shift.routes') },
  { path: '/leaves', router: require('./routes/leaves.routes') },
  { path: '/noti', router: require('./routes/noti.routes') },
  { path: '/break', router: require('./routes/breakTime.routes') },
  { path: '/extraHours', router: require('./routes/extraHoursAdjustment.routes') },
];

// Register routes
routes.forEach((route) => {
  app.use(route.path, route.router);
});

// Notification endpoint
// Endpoint to send notifications
app.post('/api/send-notification', async (req, res) => {
  const { userId, message } = req.body;

  try {
    const response = await beamsClient.publishToUsers([userId], {
      apns: {
        aps: {
          alert: {
            title: 'Hello!',
            body: message,
          },
        },
      },
      fcm: {
        notification: {
          title: 'Hello!',
          body: message,
        },
      },
    });

    console.log('Notification sent:', response);
    res.status(200).json({ success: true, response });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check endpoints
app.get('/', (req, res) => {
  res.send('Server is running');
});

app.get('/ins', (req, res) => {
  res.send('Institution endpoint');
});

// Handle preflight requests
app.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://ess-admin-lime.vercel.app');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.sendStatus(200);
});

// Error handling middleware
//app.use(errorHandler);

// Start server
const port = process.env.PORT || 9000;
app.listen(port, process.env.SERVER_IP, () => {
  console.log(`Server running at http://${process.env.SERVER_IP}:${port}`);
});