const mongoose = require("mongoose");

const driverStatusSchema = new mongoose.Schema({
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  currentLocation: {
    type: { type: String, enum: ['Point'], required: true, default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  status: { 
    type: String, 
    enum: ['online', 'offline', 'on_trip'], 
    default: 'offline', 
    required: true 
  },
  lastSeen: { type: Date, default: Date.now }
});

// Index untuk query geospasial (penting!)
driverStatusSchema.index({ currentLocation: '2dsphere' });
// Index untuk pencarian driver berdasarkan status dan driver ID
driverStatusSchema.index({ driver: 1, status: 1 });
// Index untuk mengurutkan berdasarkan lastSeen (jika diperlukan)
driverStatusSchema.index({ lastSeen: -1 });

module.exports = mongoose.model("DriverStatus", driverStatusSchema);