const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['User', 'Admin', 'Super Admin'], default: 'User' },
    status: { type: String, enum: ['Active', 'Suspended'], default: 'Active' },
    ticketCount: { type: Number, default: 0 },
    lastLogin: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);