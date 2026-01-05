const express = require('express');
const router = express.Router();
const { 
    adminLogin, 
    getDashboardStats, 
    getAllUsers, 
    updateUserStatus, 
    updateUserRole,
    getAnalyticsData,
    getAllBookings,
    toggleCheckIn
} = require('../controllers/adminController');

router.post('/login', adminLogin);
router.get('/dashboard-stats', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);
router.put('/users/:id/role', updateUserRole);
router.get('/analytics', getAnalyticsData);
router.get('/bookings', getAllBookings);
router.put('/bookings/:id/checkin', toggleCheckIn);
module.exports = router;