const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // ⬅️ Tambahkan ini
require('dotenv').config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',// alamat frontend-mu
  credentials: true
})); 
app.use(express.json()); // Baru ini

console.log('MONGODB_URI:', process.env.MONGODB_URI);

// connect DB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Debug middleware - tambahkan ini sebelum routes
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// use route
const rideRoutes = require("./routes/rideRoutes");
app.use("/api", rideRoutes);

// run
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
