const express = require("express");
const { getRides, createRide } = require("../controllers/rideControllers");

const router = express.Router();

router.get("/", getRides);
router.post("/", createRide);

module.exports = router;
