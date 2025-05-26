const express = require("express");
const { findDriver,createBooking, getBooking, estimateFare } = require("../controllers/rideControllers");

const router = express.Router();

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "API is working!" });
});

// Estimation route
router.post("/estimate", estimateFare);

router.get("/findRider",findDriver);

// Main routes  
router.post("/booking", createBooking);
router.get("/booking/:id", getBooking);

module.exports = router;
