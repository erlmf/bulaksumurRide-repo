const { bookingDB, driverDB } = require('../config/database');
const { schema: BookingSchema } = require('../models/Booking');
const { schema: DriverStatusSchema } = require('../models/DriverStatus');

const Booking = bookingDB.model('Booking', BookingSchema);
const DriverStatus = driverDB.model('DriverStatus', DriverStatusSchema);

const calculateDistance = require('../utils/calculateDistance');
const { getBoundingBox } = require('../utils/locationUtils');
const centrePoint = [110.3819, -7.7864];
// exports.inserDriver((req, res)=>{
//   try{

//   }catch(er){
//     console.error('Error in inserting Driver:', er.message);
//   }
// })

// the body will contain pickup coordinate, the type of payment, and also the distance
// exports.findDriver = async (req, res) => {
//   console.log("Finding driver for:", req.body);
//   try {
//     const { bookingId, pickup, paymentMethod, distEstimate } = req.body;
//     if (!bookingId || !pickup || !paymentMethod || !distEstimate) {
//       return res.status(400).json({ error: "Pickup, payment method, booking id, and distance estimate are required." });
//     }

//     // Get bounding box for initial filtering (5km radius)
//     // const boundingBox = getBoundingBox(pickup, 5);

//     // Find online drivers within bounding box
//     const nearbyDrivers = await DriverStatus.find({
//       status: "online",
//       currentLocation: {
//         $near: {
//           $geometry: {
//             type: "Point",
//             coordinates: centrePoint 
//           },
//           $maxDistance: 5000 // meter
//         }
//       }
//     }).select('name phoneNumber vehicleType vehicleModel licensePlate rating currentLocation')
//       .sort({ rating: -1 })
//       .limit(20).slice(0, 5); // take top 5 closest

//     if (driversWithin5km.length === 0) {
//       return res.status(404).json({ error: "No drivers available nearby" });
//     }

//     res.json({
//       success: true,
//       drivers: driversWithin5km.map(driver => ({
//         name: driver.name,
//         phoneNumber: driver.phoneNumber,
//         vehicle: {
//           type: driver.vehicleType,
//           model: driver.vehicleModel,
//           licensePlate: driver.licensePlate
//         },
//         rating: driver.rating,
//         location: driver.currentLocation
//       }))
//     });

//   } catch (err) {
//     console.error('error in findDriver:', err.message);
//     res.status(500).json({ error: err.message });
//   }
// }

//will reevaluate the importance of this function later since it overlaps a lot with findDriver function and can be added a query parameter to determine is this for finding the nearest driver or for the intial map loading 

// exports.getDriver = async (req, res) => {
//   console.log('fetching driver for initial map loading');
//   const { lng = centrePoint[0], lat = centrePoint[1], maxDistance = 5000 } = req.query;
//   try {

//     const driver = await DriverStatus.find({
//       status: 'online',
//       currentLocation: {
//         $near: {
//           $geometry: {
//             type: "Point",
//             coordinates: [parseFloat(lng), parseFloat(lat)] // Example coordinates, replace with actual
//           },
//           $maxDistance: parseInt(maxDistance) // 5km radius
//         }
//       }
//     }).select('name vehicleType currentLocation').sort({ rating: -1 })

//     res.json({
//       success: true,
//       drivers: driver.map(driver => {
//         return {
//           name: driver.name,
//           vehicle: {
//             type: driver.vehicleType,
//           },
//           location: driver.currentLocation
//         }
//       })
//     })
//   } catch (err) {
//     console.error('Error fetching driver from db', err);
//     return res.status(500).json({ error: err.message })
//   }
// }


exports.getDrivers = async (req, res) => {
  console.log("Getting drivers:", { body: req.body, query: req.query });
  
  try {
    // Determine if this is for booking or map loading based on request method and data
    const isBookingRequest = req.body
    console.log('isBookingRequest:', isBookingRequest);
    let searchLocation, maxDistance, responseType;
    
    if (isBookingRequest) {
      // Booking request - use POST body data
      const { bookingId, pickup, paymentMethod, distEstimate } = req.body;
      //pickup will contain JSON of the lat and also the lng 

      // Validate required fields for booking
      if (!bookingId || !pickup || !paymentMethod || !distEstimate) {
        return res.status(400).json({ 
          error: "Pickup, payment method, booking id, and distance estimate are required." 
        });
      }

      // Validate pickup coordinates
      if (!pickup.lat || !pickup.lng || 
          typeof pickup.lat !== 'number' || typeof pickup.lng !== 'number') {
        return res.status(400).json({ 
          error: "Valid pickup coordinates (lat, lng) are required." 
        });
      }

      searchLocation = [pickup.lng, pickup.lat];
      maxDistance = 5000; // 5km for booking
      responseType = 'booking';
      
    } else {
      // Map loading request - use query parameters
      const { lng = centrePoint[0], lat = centrePoint[1], maxDistance: queryMaxDistance = 5000 } = req.query;
      
      searchLocation = [parseFloat(lng), parseFloat(lat)];
      maxDistance = parseInt(queryMaxDistance);
      responseType = 'map';
    }

    // Find online drivers within specified radius
    const nearbyDrivers = await DriverStatus.find({
      status: "online",
      currentLocation: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: searchLocation
          },
          $maxDistance: maxDistance
        }
      }
    })
    .select('name phoneNumber vehicleType vehicleModel licensePlate rating currentLocation')
    .sort({ rating: -1 })
    .limit(responseType === 'booking' ? 5 : 20); // Limit based on request type

    if (nearbyDrivers.length === 0) {
      return res.status(404).json({ 
        error: "No drivers available nearby",
        searchRadius: `${maxDistance / 1000}km`,
        searchCenter: {
          lng: searchLocation[0],
          lat: searchLocation[1]
        }
      });
    }

    // Build response based on request type
    if (responseType === 'booking') {
      // Detailed response for booking with distance calculations
      const driversWithDistance = nearbyDrivers.map(driver => {
        const [driverLng, driverLat] = driver.currentLocation.coordinates;
        const distance = calculateDistance(
          { lat: searchLocation[1], lng: searchLocation[0] },
          { lat: driverLat, lng: driverLng }
        );
        
        return {
          ...driver.toObject(),
          distanceFromPickup: Math.round(distance * 100) / 100
        };
      });

      // Sort by distance first, then by rating
      const sortedDrivers = driversWithDistance.sort((a, b) => {
        const distanceDiff = a.distanceFromPickup - b.distanceFromPickup;
        if (Math.abs(distanceDiff) < 0.5) {
          return b.rating - a.rating;
        }
        return distanceDiff;
      });

      res.json({
        success: true,
        type: 'booking',
        count: sortedDrivers.length,
        searchRadius: `${maxDistance / 1000}km`,
        drivers: sortedDrivers.map(driver => ({
          id: driver._id,
          name: driver.name,
          phoneNumber: driver.phoneNumber,
          vehicle: {
            type: driver.vehicleType,
            model: driver.vehicleModel,
            licensePlate: driver.licensePlate
          },
          rating: driver.rating,
          location: driver.currentLocation,
          distanceFromPickup: driver.distanceFromPickup
        }))
      });
      
    } else {
      // Simplified response for map loading
      res.json({
        success: true,
        type: 'map',
        count: nearbyDrivers.length,
        searchRadius: `${maxDistance / 1000}km`,
        drivers: nearbyDrivers.map(driver => ({
          id: driver._id,
          name: driver.name,
          vehicle: {
            type: driver.vehicleType,
          },
          location: driver.currentLocation
        }))
      });
    }

  } catch (err) {
    console.error('Error in getDrivers:', err.message);
    console.error('Stack trace:', err.stack);
    
    // Handle specific MongoDB errors
    if (err.name === 'CastError') {
      return res.status(400).json({ 
        error: "Invalid data format provided" 
      });
    }
    
    res.status(500).json({ 
      error: "Internal server error while fetching drivers",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};


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
    const fare = Math.ceil(distance * 10000) + 200000; // bisa ubah tarif/km di sini

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

