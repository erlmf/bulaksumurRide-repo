const { bookingDB, driverDB } = require('../config/database');
const { schema: BookingSchema } = require('../models/Booking');
const { schema: DriverStatusSchema } = require('../models/DriverStatus');

const Booking = bookingDB.model('Booking', BookingSchema);
const DriverStatus = driverDB.model('DriverStatus', DriverStatusSchema);

const calculateDistance = require('../utils/calculateDistance');
const { getBoundingBox } = require('../utils/locationUtils');



// the body will contain pickup coordinate, the type of payment, and also the distance
exports.findDriver = async (req, res) => {
  console.log("Finding driver for:", req.body);
  try {
    const { bookingId, pickup, paymentMethod, distEstimate } = req.body;
    if (!bookingId || !pickup || !paymentMethod || !distEstimate) {
      return res.status(400).json({ error: "Pickup, payment method, booking id, and distance estimate are required." });
    }

    // Get bounding box for initial filtering (5km radius)
    const boundingBox = getBoundingBox(pickup, 5);

    // Find online drivers within bounding box
    /**
     * Finds nearby drivers based on their online status and current location within a bounding box.
     *
     * @param {Object} boundingBox - The bounding box to search within.
     * @param {number} boundingBox.minLon - The minimum longitude of the bounding box.
     * @param {number} boundingBox.maxLon - The maximum longitude of the bounding box.
     * @param {number} boundingBox.minLat - The minimum latitude of the bounding box.
     * @param {number} boundingBox.maxLat - The maximum latitude of the bounding box.
     * @returns {Promise<Array<{
     *   name: string,
     *   phoneNumber: string,
     *   vehicleType: string,
     *   vehicleModel: string,
     *   licensePlate: string,
     *   rating: number,
     *   currentLocation: {
     *     type: string,
     *     coordinates: [number, number]
     *   },
     *   distanceEstimate?: number // Estimated distance in meters (if calculated elsewhere)
     * }>>} A promise that resolves to an array of nearby driver objects, each optionally including a distance estimate in meters.
     */
    const nearbyDrivers = await DriverStatus.find({
      status: 'online',
      'currentLocation.coordinates.0': { 
        $gte: boundingBox.minLon,
        $lte: boundingBox.maxLon
      },
      'currentLocation.coordinates.1': {
        $gte: boundingBox.minLat,
        $lte: boundingBox.maxLat
      }
    })
    .select('name phoneNumber vehicleType vehicleModel licensePlate rating currentLocation')
    // Add distance field and sort by distance
    .sort({ rating: -1 })
    .limit(5);

    if (nearbyDrivers.length === 0) {
      return res.status(404).json({ error: "No drivers available nearby" });
    }

    res.json({
      success: true,
      drivers: nearbyDrivers.map(driver => ({
        name: driver.name,
        phoneNumber: driver.phoneNumber,
        vehicle: {
          type: driver.vehicleType,
          model: driver.vehicleModel,
          licensePlate: driver.licensePlate
        },
        rating: driver.rating,
        location: driver.currentLocation
      }))
    });

  } catch(err) {
    console.error('error in findDriver:', err.message);
    res.status(500).json({ error: err.message });
  }
}

exports.createBooking = async (req, res) => {
  console.log("BODY RECEIVED:", req.body);

  try {
    const { pickup, dropoff, paymentMethod } = req.body;

    if (!pickup || !dropoff) {
      return res.status(400).json({ error: "Pickup and dropoff are required." });
    }

    // will separate this into service provider later so that the controller will only handle the higher level logic
    //any detail of the logic will be handled inside the service.js provider will also refactor the folder into separate to mimic microservices
    const distance = calculateDistance(pickup, dropoff);
    const fare = Math.ceil(distance * 3000); // bisa ubah tarif/km di sini

    const booking = new Booking({
      pickup,
      dropoff,
      distance,
      fare,
      paymentMethod: paymentMethod || "Cash", // default fallback
    });

    await booking.save();
    res.status(201).json({ bookingId: booking._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.status(200).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.testBooking = async (req, res) => {
  console.log("Test booking received:", req.body);
  res.json({
    message: "Data received successfully",
    data: req.body
  });
};

exports.estimateFare = async (req, res) => {
  try {
    console.log("📩 Incoming request to /api/estimate:", req.body);

    const { pickup, dropoff } = req.body;

    if (!pickup || !dropoff) {
      console.warn("⚠️ Missing pickup/dropoff");
      return res.status(400).json({ error: "Pickup and dropoff are required." });
    }

    const distance = calculateDistance(pickup, dropoff);
    const fare = Math.ceil(distance * 3000);

    console.log("✅ Estimation result:", { distance, fare });

    res.status(200).json({
      distance: distance.toFixed(2),
      fare
    });

  } catch (err) {
    console.error("❌ EstimateFare error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

