const { bookingDB, driverDB } = require('../config/database');
const mongoose = require('mongoose');

exports.testMongoConnection = async (req, res) => {
  try {
    // Test both connections
    const connections = {
      bookingDB: bookingDB.readyState === 1 ? 'Connected' : 'Disconnected',
      driverDB: driverDB.readyState === 1 ? 'Connected' : 'Disconnected',
    };

    // Test schema on each connection
    const BookingModel = bookingDB.model('Booking', require('../models/Booking').schema);
    const DriverModel = driverDB.model('DriverStatus', require('../models/DriverStatus').schema);

    const results = {
      connections,
      schemas: {
        booking: await BookingModel.exists({}),
        driver: await DriverModel.exists({}),
      }
    };

    const driverModel = driverDB.model('DriverStatus');
    const indexInfo = await driverModel.collection.getIndexes();

    res.status(200).json({
      status: 'success',
      data: {
        connections: {
          bookingDB: bookingDB.readyState === 1 ? 'Connected' : 'Disconnected',
          driverDB: driverDB.readyState === 1 ? 'Connected' : 'Disconnected',
        },
        driverDB: {
          initialized: true,
          indexes: Object.keys(indexInfo)
        }
      }
    });
    
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      message: "Connection check failed",
      error: error.message 
    });
  }
};
