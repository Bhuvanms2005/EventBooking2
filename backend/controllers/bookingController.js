const Booking = require('../models/Booking');
const Event = require('../models/Event');
const User = require('../models/User');

exports.createBooking = async (req, res) => {
    try {
        const { eventId, ticketCount, totalPrice } = req.body;
        const userId = req.user.id;

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: "Event not found" });

        if (event.availableTickets < ticketCount) {
            return res.status(400).json({ message: "Not enough tickets available" });
        }

        const newBooking = new Booking({
            event: eventId,
            user: userId,
            ticketCount,
            totalPrice
        });

        await newBooking.save();

        // Atomic updates
        event.availableTickets -= ticketCount;
        await event.save();

        await User.findByIdAndUpdate(userId, { $inc: { ticketCount: ticketCount } });

        res.status(201).json({ message: "Booking successful!", booking: newBooking });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.getMyBookings = async (req, res) => {
    try {
        const userId = req.user.id;
        const bookings = await Booking.find({ user: userId })
            .populate('event')
            .sort({ createdAt: -1 });

        res.status(200).json(bookings);
    } catch (err) {
        res.status(500).json({ message: "Error fetching your bookings" });
    }
};