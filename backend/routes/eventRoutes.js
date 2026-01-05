const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.post('/', eventController.createEvent);
router.get('/all', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
router.put('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

router.get('/public/all', eventController.getAllEvents);
router.get('/public/cities', eventController.getUniqueCities);
router.get('/public/categories', eventController.getUniqueCategories);
router.get('/public/filter', eventController.getFilteredEvents);
router.get('/public/:id', eventController.getEventDetails);

module.exports = router;