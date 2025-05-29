const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
  rider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  pickupLocation: {
    type: { type: String, enum: ['Point'], required: true, default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  destinationLocation: {
    type: { type: String, enum: ['Point'], required: true, default: 'Point' },
    coordinates: { type: [Number], required: true }
  },
  pickupAddress: { type: String }, // Opsional, untuk tampilan
  destinationAddress: { type: String }, // Opsional, untuk tampilan
  status: {
    type: String,
    enum: [
      'pending_fare',         // Rider request, tunggu estimasi fare (V1: fare dihitung langsung)
      'pending_driver',       // Fare didapat, tunggu driver
      'no_driver_available',  // Tidak ada driver ditemukan
      'driver_assigned',      // Sistem telah assign driver, tunggu driver accept (jika flow-nya begitu)
      'accepted_by_driver',   // Driver menerima (ini bisa jadi 'driver_assigned' jika auto-assign)
      'driver_en_route',      // Driver menuju lokasi pickup
      'driver_arrived',       // Driver sampai di lokasi pickup
      'in_progress',          // Perjalanan dimulai
      'completed',            // Perjalanan selesai
      'cancelled_by_rider',
      'cancelled_by_driver',
      'payment_pending',
      'payment_failed'
    ],
    default: 'pending_driver' // V1: Langsung 'pending_driver' setelah fare dihitung saat request
  },
  fareEstimate: { type: Number },
  actualFare: { type: Number }, // Setelah perjalanan selesai
  distanceKm: { type: Number }, // Jarak perjalanan
  durationMinutes: { type: Number }, // Durasi perjalanan

  requestedAt: { type: Date, default: Date.now },
  driverAssignedAt: { type: Date },
  acceptedByDriverAt: { type: Date },
  driverEnRouteAt: {type: Date },
  driverArrivedAt: { type: Date },
  startedAt: { type: Date },
  completedAt: { type: Date },
  cancelledAt: { type: Date },
  cancellationReason: { type: String },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

rideSchema.index({ rider: 1, status: 1 });
rideSchema.index({ driver: 1, status: 1 });
rideSchema.index({ status: 1, requestedAt: -1 }); // Untuk query ride berdasarkan status dan waktu

module.exports = mongoose.model("Ride", rideSchema);