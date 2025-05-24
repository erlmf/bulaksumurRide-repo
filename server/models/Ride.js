const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
  origin: String,
  destination: String,
  user: String,
  time: Date,
  geojson: Object // simpan data GeoJSON di sini
});

module.exports = mongoose.model("Ride", rideSchema);
