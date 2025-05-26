require('dotenv').config();
const mongoose = require('mongoose');
const { driverDB } = require('../config/database');
const DriverStatus = require('../models/DriverStatus');

// Center point (Bulaksumur UGM area)
const CENTER_POINT = {
    latitude: -7.7713,
    longitude: 110.3777
};

// Mock data generator functions
const generateLicensePlate = () => {
    const areas = ['AB', 'AA', 'AD'];
    const numbers = Math.floor(Math.random() * 9000) + 1000;
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const suffix = letters.charAt(Math.floor(Math.random() * letters.length)) +
        letters.charAt(Math.floor(Math.random() * letters.length));
    return `${areas[Math.floor(Math.random() * areas.length)]} ${numbers} ${suffix}`;
};

const generateLocation = () => {
    // Generate random point within ~2km of center
    const lat = CENTER_POINT.latitude + (Math.random() - 0.5) * 0.036;
    const lng = CENTER_POINT.longitude + (Math.random() - 0.5) * 0.036;
    return { type: 'Point', coordinates: [lng, lat] };
};

const mockDrivers = Array(100).fill(null).map((_, index) => ({
    driverId: `D${(1000 + index).toString()}`,
    name: `Driver ${index + 1}`,
    phoneNumber: `+62812${Math.floor(Math.random() * 90000000 + 10000000)}`,
    vehicleType: 'Motorcycle',
    vehicleModel: ['Honda Beat', 'Honda Vario', 'Yamaha NMAX', 'Honda PCX'][Math.floor(Math.random() * 4)],
    licensePlate: generateLicensePlate(),
    rating: (Math.random() * 2 + 3).toFixed(1), // Rating between 3.0 and 5.0
    completedOrders: Math.floor(Math.random() * 1000),
    currentLocation: generateLocation(),
    status: ['online', 'offline', 'on_trip'][Math.floor(Math.random() * 3)],
    lastSeen: new Date()
}));

const seedDrivers = async () => {
    try {
        console.log('Attempting to connect with MONGODB_URI:, mongodb+srv://user1:erw1in475hdfs%25hg5@cluster-coba.uq3irfb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-coba');
        await new Promise((resolve, reject) => {
            if (driverDB.readyState === 1) { // 1: connected
                return resolve();
            }
            if (driverDB.readyState === 2) { // 2: connecting
                console.log('driverDB is connecting...');
            }
            driverDB.once('connected', resolve);
            driverDB.once('error', (err) => {
                console.error('Connection error during seeder wait:', err);
                reject(err); // Reject promise jika ada error koneksi
            });
        });
        const DriverModel = driverDB.model('DriverStatus', DriverStatus.schema);

        // Check existing data
        const existingCount = await DriverModel.countDocuments();
        if (existingCount > 0) {
            console.log('⚠️ Clearing existing driver data...');
            await DriverModel.deleteMany({});
        }

        // Insert mock data
        await DriverModel.insertMany(mockDrivers);
        console.log('✅ Drivers seeded successfully');

        // Log sample data
        const sampleDriver = await DriverModel.findOne();
        console.log('📍 Sample driver created:', {
            name: sampleDriver.name,
            location: sampleDriver.currentLocation
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedDrivers();
