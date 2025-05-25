const Booking = require('../models/Booking');
const calculateDistance = require('../utils/calculateDistance');


exports.createBooking = async (req, res) => {
  console.log("BODY RECEIVED:", req.body);

  try {
    const { pickup, dropoff, paymentMethod } = req.body;

    if (!pickup || !dropoff) {
    return res.status(400).json({ error: "Pickup and dropoff are required." });
  }


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

