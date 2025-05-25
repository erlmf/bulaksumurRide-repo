const mongoose = require('mongoose'); // Import mongoose

exports.testMongoConnection = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      res.status(200).json({ message: "Successfully connected to MongoDB using Mongoose!" });
    } else {
      res.status(500).json({ message: "MongoDB connection is not ready.", readyState: mongoose.connection.readyState });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to check connection status", error });
  }
};
