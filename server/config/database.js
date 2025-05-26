const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const bookingDB = mongoose.createConnection(process.env.MONGODB_URI);
const driverDB = mongoose.createConnection(process.env.MONGODB_URI2);

if (!process.env.MONGODB_URI || !process.env.MONGODB_URI2) {
    console.error("FATAL ERROR: MONGODB_URI or MONGODB_URI2 is not defined in .env file.");
    process.exit(1); // Keluar jika URI tidak ada
}

const initializeDriverDB = async () => {
    try {
        const DriverStatus = driverDB.model('DriverStatus', require('../models/DriverStatus').schema);
        
        // Create indexes
        await DriverStatus.createIndexes();
        console.log('✅ Driver DB indexes created');
        
        // Verify connection
        await driverDB.asPromise();
        console.log('✅ Driver DB initialized');
        
        return true;
    } catch (error) {
        console.error('❌ Driver DB initialization failed:', error);
        throw error;
    }
};

module.exports = {
    bookingDB,
    driverDB,
    initializeDriverDB
};
