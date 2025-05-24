const Ride = require("../models/Ride");

// GET all rides
exports.getRides = async (req, res) => {
  try {
    const rides = await Ride.find();
    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST new ride
exports.createRide = async (req, res) => {
  try {
    const newRide = await Ride.create(req.body);
    res.status(201).json(newRide);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
