const mongoose = require("mongoose");

const driverStatusSchema = new mongoose.Schema({
  // Informasi Identitas Driver (sebelumnya dari User model)
  driverId: { // Bisa menggunakan string unik atau mongoose.Types.ObjectId() baru jika tidak ada sistem ID eksternal
    type: String, // Atau mongoose.Schema.Types.ObjectId jika Anda ingin format ObjectId
    required: true,
    unique: true, // Setiap driver harus unik
    index: true    // Index untuk pencarian cepat berdasarkan driverId
  },
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true }, // Pertimbangkan validasi format jika perlu

  // Detail Kendaraan Driver
  vehicleType: { type: String, required: true }, // e.g., 'Motorcycle', 'Car'
  vehicleModel: { type: String, required: true }, // e.g., 'Honda Beat', 'Toyota Avanza'
  licensePlate: { type: String, required: true }, // Plat nomor biasanya unik

  // Data Performa Driver
  rating: { type: Number, default: 0, min: 0, max: 5 }, // Rating rata-rata driver
  completedOrders: { type: Number, default: 0 }, // Jumlah order yang pernah diselesaikan

  // Data Lokasi dan Status Real-time (atau statis untuk V1)
  currentLocation: { // GeoJSON Point untuk lokasi terkini driver
    type: { type: String, enum: ['Point'], required: true, default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  status: { // Status driver saat ini
    type: String,
    enum: ['online', 'offline', 'on_trip'],
    default: 'offline',
    required: true
  },
  lastSeen: { type: Date, default: Date.now } // Kapan terakhir kali status/lokasi diupdate
}, { timestamps: true }); // Menambahkan createdAt dan updatedAt secara otomatis

// Index untuk query geospasial (SANGAT PENTING untuk pencarian driver terdekat)
driverStatusSchema.index({ currentLocation: '2dsphere' });

// Index untuk pencarian driver berdasarkan status (dan mungkin kriteria lain nanti)
driverStatusSchema.index({ status: 1 });
driverStatusSchema.index({ status: 1, rating: -1 }); // Cari driver online, urutkan rating tertinggi
driverStatusSchema.index({ status: 1, completedOrders: -1 }); // Cari driver online, urutkan order terbanyak

// Index untuk mengurutkan berdasarkan lastSeen (jika diperlukan)
driverStatusSchema.index({ lastSeen: -1 });

// Pastikan licensePlate unik
driverStatusSchema.index({ licensePlate: 1 }, { unique: true });


module.exports = mongoose.model("DriverStatus", driverStatusSchema);