// Import the Firebase Admin SDK
const admin = require("firebase-admin") ;
const dotenv = require('dotenv');
// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),}),
  });
}

// Export the admin app instance
exports.default = admin;
