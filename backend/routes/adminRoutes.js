const express = require('express');
const router = express.Router();
const { 
    adminLogin, getDashboardStats, getAllUsers, updateUserStatus, 
    updateUserRole, getAnalyticsData, getAllBookings, toggleCheckIn
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/login', adminLogin);
router.get('/dashboard-stats', protect, adminOnly, getDashboardStats);
router.get('/users', protect, adminOnly, getAllUsers);
router.put('/users/:id/status', protect, adminOnly, updateUserStatus);
router.put('/users/:id/role', protect, adminOnly, updateUserRole);
router.get('/analytics', protect, adminOnly, getAnalyticsData);
router.get('/bookings', protect, adminOnly, getAllBookings);
router.put('/bookings/:id/checkin', protect, adminOnly, toggleCheckIn);

module.exports = router;