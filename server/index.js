const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { bookingDB, driverDB, initializeDriverDB, initializeBookingDB } = require('./config/database');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());


// the middleware starts here make sure to refactor this to another file
// Debug middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// ✅ Tambahkan kedua route ini
const mongoRoutes = require('./routes/mongoRoutes');
const rideRoutes = require('./routes/rideRoutes'); // ⬅️ Tambahkan ini
const driverRoutes = require('./routes/driverRoutes');

app.use('/api', mongoRoutes);
app.use('/api', rideRoutes); // ⬅️ Tambahkan ini juga
app.use('/api/drivers', driverRoutes);


const startServer = async () => {
  try {
    await initializeDriverDB();
    await initializeBookingDB();
    const PORT = process.env.PORT || 5050;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};
startServer();
