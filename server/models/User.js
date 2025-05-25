const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {type: String, required:true},
    email: { type: String, required: true, unique: true, trim:true, lowercase:true},
    role: {type: String, enum: ['rider', 'driver'], required: true},
    phoneNumber: { type: String, unique: true, sparse: true},
    vehicleDetails: {
        type: {type:String},
        licensePlate: {type:String},
        model: { type:String},
        color: { type: String}
    },
    isActive: {type: Boolean ,default: true},
    createdAt: {type:Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);