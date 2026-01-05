const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ticketCount: { type: Number, default: 1 },
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Cancelled'], default: 'Completed' },
    checkInStatus: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);