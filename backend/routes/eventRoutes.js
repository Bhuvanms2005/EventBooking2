const express = require('express');
const router = express.Router();
const { 
    createEvent, 
    getAllEvents, 
    getEventById, 
    updateEvent, 
    deleteEvent 
} = require('../controllers/eventController');
const eventController = require('../controllers/eventController');
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.post('/create',upload.single('image'), createEvent);
router.get('/all', getAllEvents);
router.get('/:id', getEventById);
router.put('/:id',upload.single('image'), updateEvent);
router.delete('/:id', deleteEvent);

router.get('/public/all', eventController.getAllEvents);
router.get('/public/cities', eventController.getUniqueCities);
router.get('/public/categories', eventController.getUniqueCategories);
router.get('/public/filter', eventController.getFilteredEvents);
router.get('/public/:id', eventController.getEventDetails);

module.exports = router;