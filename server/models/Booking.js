const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  pickup: {
    lat: Number,
    lng: Number
  },
  dropoff: {
    lat: Number,
    lng: Number
  },
  distance: Number,
  fare: Number,
  paymentMethod: String,
  status: {
    type: String,
    default: 'searching'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', BookingSchema);
