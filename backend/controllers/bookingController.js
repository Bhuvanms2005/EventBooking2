const Booking = require('../models/Booking');
const Event = require('../models/Event');
const User = require('../models/User');
const {sendBookingEmail}=require('../utils/sendEmail');
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

        event.availableTickets -= ticketCount;
        await event.save();

        const user = await User.findByIdAndUpdate(userId, { $inc: { ticketCount: ticketCount } }, { new: true });

        // WRAP THE EMAIL IN A TRY/CATCH
        try {
            await sendBookingEmail(user.email, {
                eventTitle: event.title,
                ticketCount: ticketCount,
                totalPrice: totalPrice
            });
        } catch (mailError) {
            console.error("Booking saved, but email failed:", mailError.message);
            // We do NOT send a 500 error here, so the user sees "Booking Successful"
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
            .populate('user', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json(bookings);
    } catch (err) {
        res.status(500).json({ message: "Error fetching your bookings" });
    }
};