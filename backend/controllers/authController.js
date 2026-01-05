const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        // Create user - role defaults to 'User' based on your model
        const user = new User({
            name,
            email,
            password // Will be hashed by the pre-save hook in User.js
        });

        await user.save();

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(201).json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        console.error("SIGNUP ERROR DETAILS:", err);
        res.status(500).json({ message: "Registration failed. Please try again.",error:err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Email or Password" });
        }

        if (user.status === 'Suspended') {
            return res.status(403).json({ message: "Your account is suspended. Contact support." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Email or Password" });
        }

        // Update last login time
        user.lastLogin = Date.now();
        await user.save();

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ message: "Login failed" });
    }
};
 

exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).json({ message: "No user found with this email" });

        // Generate a 10-minute reset token
        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '10m' });
        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

        const message = `You requested a password reset. Please click the link below to reset your password. This link expires in 10 minutes:\n\n${resetUrl}`;

        await sendEmail({
            email: user.email,
            subject: 'EventPro Password Reset Request',
            message
        });

        res.status(200).json({ message: "Reset link sent to email" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Email could not be sent",devError: err.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) return res.status(400).json({ message: "Invalid token" });

        user.password = req.body.password; // This will be hashed by your User.js pre-save hook
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
        res.status(400).json({ message: "Token expired or invalid" });
    }
};