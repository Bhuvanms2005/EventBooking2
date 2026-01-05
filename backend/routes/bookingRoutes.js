const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/authMiddleware');

router.post('/create', auth, bookingController.createBooking);
router.get('/my', auth, bookingController.getMyBookings);
module.exports = router;