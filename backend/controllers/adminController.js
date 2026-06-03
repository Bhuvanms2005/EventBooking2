const User = require('../models/User');
const Event = require('../models/Event');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Booking = require('../models/Booking');

exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const admin = await User.findOne({ email });
        if (!admin || !['Admin', 'Super Admin'].includes(admin.role)) {
            return res.status(401).json({ message: "Access Denied: Admin privileges required" });
        }

        if (admin.status === 'Suspended') {
            return res.status(403).json({ message: "Your account is suspended." });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const token = jwt.sign(
            { id: admin._id, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role }
        });
    } catch (err) {
        console.error("Admin Login Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.getDashboardStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments({ role: 'User' });
        const eventCount = await Event.countDocuments({ status: 'Upcoming' });

        // Use Booking model for accurate booking counts
        const bookingAgg = await Booking.aggregate([
            { $match: { status: 'Confirmed' } },
            { $group: { _id: null, totalBookings: { $sum: '$ticketCount' }, totalRevenue: { $sum: '$totalPrice' } } }
        ]);

        const totalBookings = bookingAgg[0]?.totalBookings || 0;
        const totalRevenue = bookingAgg[0]?.totalRevenue || 0;

        // Get recent bookings (last 5)
        const recentBookings = await Booking.find()
            .populate('event', 'title')
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            adminName: "Admin",
            stats: [
                { id: 1, label: "Total Bookings", value: totalBookings.toLocaleString('en-IN'), growth: "+10%", status: "Active" },
                { id: 2, label: "Active Events", value: eventCount.toString(), growth: "+2%", status: "Live" },
                { id: 3, label: "Revenue", value: `₹${totalRevenue.toLocaleString('en-IN')}`, growth: "+15%", status: "Completed" },
                { id: 4, label: "Platform Users", value: userCount.toLocaleString('en-IN'), growth: "+5%", status: "Verified" }
            ],
            recentBookings: recentBookings.map(b => ({
                id: b._id,
                name: b.event?.title || 'Unknown Event',
                user: b.user?.email || 'Unknown User',
                amount: `₹${b.totalPrice}`,
                status: b.status,
                date: b.createdAt
            })),
            notifications: [
                { id: 1, user: "System", message: "Database connection stable", time: "Just now" }
            ]
        });
    } catch (err) {
        console.error("Dashboard Stats Error:", err);
        res.status(500).json({ message: "Error fetching dashboard data" });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Error fetching user directory" });
    }
};

exports.updateUserStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['Active', 'Suspended'].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }
        const user = await User.findByIdAndUpdate(
            req.params.id, { status }, { new: true }
        ).select('-password');
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Failed to update account status" });
    }
};

exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (!['User', 'Admin', 'Super Admin'].includes(role)) {
            return res.status(400).json({ message: "Invalid role value" });
        }
        const user = await User.findByIdAndUpdate(
            req.params.id, { role }, { new: true }
        ).select('-password');
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Failed to update permissions" });
    }
};

exports.getAnalyticsData = async (req, res) => {
    try {
        const categoryData = await Booking.aggregate([
            { $match: { status: 'Confirmed' } },
            {
                $lookup: {
                    from: 'events',
                    localField: 'event',
                    foreignField: '_id',
                    as: 'eventData'
                }
            },
            { $unwind: '$eventData' },
            {
                $group: {
                    _id: '$eventData.category',
                    revenue: { $sum: '$totalPrice' }
                }
            }
        ]);

        const events = await Event.find().sort({ date: 1 });
        const timelineData = events.map(ev => ({
            label: new Date(ev.date).toLocaleDateString('en-GB'),
            revenue: (ev.capacity - ev.availableTickets) * ev.price
        }));

        res.json({ categoryData, timelineData });
    } catch (err) {
        console.error("Analytics Error:", err);
        res.status(500).json({ message: "Failed to fetch analytics" });
    }
};

exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('event', 'title price date location')
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: "Error fetching bookings" });
    }
};

exports.toggleCheckIn = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: "Booking not found" });
        booking.checkInStatus = !booking.checkInStatus;
        await booking.save();
        res.json(booking);
    } catch (err) {
        res.status(500).json({ message: "Check-in update failed" });
    }
};