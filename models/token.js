const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  token: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;

const saveToken = async (userId, token) => {
    try {
      await Token.findOneAndUpdate(
        { userId, token }, // Look for existing token for the user
        { userId, token }, // Update or insert
        { upsert: true } // Create new if not found
      );
      console.log("Token saved successfully.");
    } catch (error) {
      console.error("Error saving token:", error);
    }
  };