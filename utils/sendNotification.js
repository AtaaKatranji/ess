const admin = require("../config/firebaseAdmin") ;  // Import the initialized Firebase Admin SDK

// Function to send notifications using FCM
exports.sendNotification = async (fcmToken, title, body) => {
  const message = {
    token: fcmToken,
    notification: {
      title: title,
      body: body,
    },
  };

  try {
    // Send notification
    const response = await admin.messaging().send(message);
    console.log("Notification sent successfully:", response);
    return response;  // Return the response from Firebase
  } catch (error) {
    console.error("Error sending notification:", error);
    throw new Error("Failed to send notification.");
  }
};