const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ticketCount: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true },
    bookingDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['Confirmed', 'Cancelled'], default: 'Confirmed' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);