const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { bookingDB, driverDB, initializeDriverDB } = require('./config/database');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',// alamat frontend-mu
  credentials: true
})); 
app.use(express.json()); // Baru ini

// Debug middleware - tambahkan ini sebelum routes
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Add mongo test routes
const mongoRoutes = require('./routes/mongoRoutes');
app.use('/api', mongoRoutes);

// Initialize databases before starting server
const startServer = async () => {
    try {
        // Initialize driver database
        await initializeDriverDB();
        
        // Start server only after DB is ready
        const PORT = process.env.PORT || 5050;
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
