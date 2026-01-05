const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const upload = require('../middleware/upload'); // Ensure this path is correct for your multer config

// Add upload.single('image') here
router.post('/create', upload.single('image'), eventController.createEvent);
router.get('/all', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
router.put('/:id', upload.single('image'), eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

router.get('/public/all', eventController.getAllEvents);
router.get('/public/cities', eventController.getUniqueCities);
router.get('/public/categories', eventController.getUniqueCategories);
router.get('/public/filter', eventController.getFilteredEvents);
router.get('/public/:id', eventController.getEventDetails);

module.exports = router;