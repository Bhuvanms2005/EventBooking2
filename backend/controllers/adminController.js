const User = require('../models/User');
const Event = require('../models/Event');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Booking = require('../models/Booking');
exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await User.findOne({ email });
        
        if (!admin || !['Admin', 'Super Admin'].includes(admin.role)) {
            return res.status(401).json({ message: "Access Denied: Admin privileges required" });
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
        res.status(500).json({ message: "Server Error" });
    }
};

exports.getDashboardStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments({ role: 'User' });
        const eventCount = await Event.countDocuments({ status: 'Upcoming' });
        
        const events = await Event.find();
        const totalRevenue = events.reduce((acc, curr) => acc + ((curr.capacity - curr.availableTickets) * curr.price), 0);
        const totalBookings = events.reduce((acc, curr) => acc + (curr.capacity - curr.availableTickets), 0);

        res.json({
            adminName: "Admin",
            stats: [
                { id: 1, label: "Total Bookings", value: totalBookings.toLocaleString('en-IN'), growth: "+10%", status: "Active" },
                { id: 2, label: "Active Events", value: eventCount.toString(), growth: "+2%", status: "Live" },
                { id: 3, label: "Revenue", value: `₹${totalRevenue.toLocaleString('en-IN')}`, growth: "+15%", status: "Completed" },
                { id: 4, label: "Platform Users", value: userCount.toLocaleString('en-IN'), growth: "+5%", status: "Verified" }
            ],
            recentBookings: [], 
            notifications: [
                { id: 1, user: "System", message: "Database connection stable", time: "Just now" }
            ]
        });
    } catch (err) {
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
        const user = await User.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { new: true }
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
        const user = await User.findByIdAndUpdate(
            req.params.id, 
            { role }, 
            { new: true }
        ).select('-password');
        
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Failed to update permissions" });
    }
};
exports.getAnalyticsData = async (req, res) => {
    try {
        const categoryData = await Event.aggregate([
            {
                $group: {
                    _id: "$category",
                    revenue: { 
                        $sum: { $multiply: [ { $subtract: ["$capacity", "$availableTickets"] }, "$price" ] } 
                    }
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
        res.status(500).json({ message: "Failed to fetch analytics" });
    }
};
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('event', 'title price')
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
        booking.checkInStatus = !booking.checkInStatus;
        await booking.save();
        res.json(booking);
    } catch (err) {
        res.status(500).json({ message: "Check-in update failed" });
    }
};