const express = require('express');
const router = express.Router();
const DriverStatus = require('../models/DriverStatus'); // sesuaikan path model
const { getDrivers } = require('../controllers/rideControllers')


//contoh request buat dapetin driver terdekat 
// GET /api/drivers/nearby?lng=110.3819&lat=-7.7864&maxDistance=5000

// this route is used for the initial map loading not for finding nearby driver

router.get('/nearby', getDrivers);

router.get('/nearby/health', (req, res) => {
  res.json({ status: 'ok', message: 'Driver service is running' });
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