const express = require('express');
const router = express.Router();
const DriverStatus = require('../models/DriverStatus'); // sesuaikan path model

// GET /api/drivers/nearby?lng=110.3819&lat=-7.7864&maxDistance=5000
router.get('/nearby', async (req, res) => {
  const { lng, lat, maxDistance = 5000 } = req.query;
  try {
    const drivers = await DriverStatus.find({
      status: "online",
      currentLocation: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    });
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/drivers/match?lng=110.3819&lat=-7.7864&maxDistance=5000
router.get('/match', async (req, res) => {
  const { lng, lat, maxDistance = 5000 } = req.query;
  try {
    const driver = await DriverStatus.findOne({
      status: "online",
      currentLocation: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    });
    res.json(driver);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;