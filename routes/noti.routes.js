
const express = require("express");
const admin = require("../config/firebaseAdmin");
const router = express.Router();
const saveToken = require("../models/token")

// Save FCM token
router.post("/save-token", async (req, res) => {
  const { userId, token } = req.body; // Ensure `userId` is passed along with the token
  try {
    await saveToken(userId, token);
    res.status(200).send("Token saved.");
  } catch (error) {
    res.status(500).send("Error saving token.");
  }
});

// Send notification
router.post("/send-notification", async (req, res) => {
  const { title, body } = req.body;

  const payload = {
    notification: {
      title,
      body,
    },
  };

  try {
    await Promise.all(
      tokens.map((token) =>
        admin.messaging().sendToDevice(token, payload)
      )
    );
    res.sendStatus(200);
  } catch (error) {
    console.error("Error sending notification:", error);
    res.sendStatus(500);
  }
});

module.exports = router;


