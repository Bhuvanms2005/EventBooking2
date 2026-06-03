const Booking = require('../models/Booking');
const Event = require('../models/Event');
const User = require('../models/User');
const { sendBookingEmail } = require('../utils/sendEmail');

exports.createBooking = async (req, res) => {
    try {
        const { eventId, ticketCount, totalPrice } = req.body;
        const userId = req.user.id;

        if (!eventId || !ticketCount || ticketCount < 1) {
            return res.status(400).json({ message: "Invalid booking data" });
        }

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: "Event not found" });

        if (event.status === 'Cancelled') {
            return res.status(400).json({ message: "This event has been cancelled" });
        }

        if (event.availableTickets < ticketCount) {
            return res.status(400).json({ message: `Only ${event.availableTickets} ticket(s) available` });
        }

        // Calculate totalPrice server-side instead of trusting client
        const calculatedTotal = event.price * ticketCount;

        const newBooking = new Booking({
            event: eventId,
            user: userId,
            ticketCount,
            totalPrice: calculatedTotal
        });

        await newBooking.save();

        event.availableTickets -= ticketCount;
        await event.save();

        await User.findByIdAndUpdate(userId, { $inc: { ticketCount: ticketCount } });

        try {
            const user = await User.findById(userId);
            await sendBookingEmail(user.email, {
                eventTitle: event.title,
                ticketCount,
                totalPrice: calculatedTotal
            });
        } catch (mailError) {
            console.error("Booking saved, but email failed:", mailError.message);
        }

        res.status(201).json({ message: "Booking successful!", booking: newBooking });
    } catch (err) {
        console.error("Booking Error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.getMyBookings = async (req, res) => {
    try {
        const userId = req.user.id;
        const bookings = await Booking.find({ user: userId })
            .populate('event')
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json(bookings);
    } catch (err) {
        res.status(500).json({ message: "Error fetching your bookings" });
    }
};