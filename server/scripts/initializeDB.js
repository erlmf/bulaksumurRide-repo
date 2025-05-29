require('dotenv').config();
const { driverDB } = require('../config/database');
const DriverStatus = require('../models/DriverStatus');

// Center point (Bulaksumur UGM area)
const CENTER_POINT = {
    latitude: -7.7713,
    longitude: 110.3777
};

const generateMockDrivers = () => {
    const generateLicensePlate = () => {
        const areas = ['AB', 'AA', 'AD'];
        const numbers = Math.floor(Math.random() * 9000) + 1000;
        const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
        const suffix = letters.charAt(Math.floor(Math.random() * letters.length)) + 
                      letters.charAt(Math.floor(Math.random() * letters.length));
        return `${areas[Math.floor(Math.random() * areas.length)]} ${numbers} ${suffix}`;
    };

    const generateLocation = () => {
        const lat = CENTER_POINT.latitude + (Math.random() - 0.5) * 0.036;
        const lng = CENTER_POINT.longitude + (Math.random() - 0.5) * 0.036;
        return { type: 'Point', coordinates: [lng, lat] };
    };

    return Array(100).fill(null).map((_, index) => ({
        driverId: `D${(1000 + index).toString()}`,
        name: `Driver ${index + 1}`,
        phoneNumber: `+62812${Math.floor(Math.random() * 90000000 + 10000000)}`,
        vehicleType: 'Motorcycle',
        vehicleModel: ['Honda Beat', 'Honda Vario', 'Yamaha NMAX', 'Honda PCX'][Math.floor(Math.random() * 4)],
        licensePlate: generateLicensePlate(),
        rating: (Math.random() * 2 + 3).toFixed(1),
        completedOrders: Math.floor(Math.random() * 1000),
        currentLocation: generateLocation(),
        status: ['online', 'offline', 'on_trip'][Math.floor(Math.random() * 3)],
        lastSeen: new Date()
    }));
};

async function initializeDB() {
    try {
        console.log('🔍 Initializing Driver Database...');
        
        // Create DriverStatus model with specific connection
        const DriverModel = driverDB.model('DriverStatus', DriverStatus.schema);
        
        // Create collection and validate schema
        await DriverModel.createCollection();
        console.log('✅ Driver schema validated');

        // Create indexes
        await DriverModel.createIndexes();
        console.log('📇 Indexes created for drivers');

        // Clear existing data
        await DriverModel.deleteMany({});
        console.log('🧹 Cleared existing data');

        // Generate and insert mock data
        const mockDrivers = generateMockDrivers();
        await DriverModel.insertMany(mockDrivers);
        
        // Log sample data
        const sampleDriver = await DriverModel.findOne();
        console.log('📍 Sample driver created:', {
            name: sampleDriver.name,
            location: sampleDriver.currentLocation,
            status: sampleDriver.status
        });

        console.log('✨ Database initialization and seeding completed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        process.exit(1);
    }
}

initializeDB();
