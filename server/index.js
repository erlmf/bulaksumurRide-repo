const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

console.log("MONGO_URI:", process.env.MONGO_URI); // ✅ Tambahkan di sini

const rideRoutes = require("./routes/rideRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/rides", rideRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(5000, () => console.log("🚀 Server running on port 5000"));
  })
  .catch((err) => console.error("DB Error:", err));
