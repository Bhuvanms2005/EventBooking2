const express = require('express');
const router = express.Router();
const { 
    createEvent, getAllEvents, getEventById, updateEvent, deleteEvent 
} = require('../controllers/eventController');
const eventController = require('../controllers/eventController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

// File type validation
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);
    if (extName && mimeType) {
        cb(null, true);
    } else {
        cb(new Error('Only image files (jpg, jpeg, png, webp) are allowed'));
    }
};

const upload = multer({ 
    storage, 
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Public routes MUST come before /:id to prevent route collision
router.get('/public/all', eventController.getAllEvents);
router.get('/public/cities', eventController.getUniqueCities);
router.get('/public/categories', eventController.getUniqueCategories);
router.get('/public/filter', eventController.getFilteredEvents);
router.get('/public/:id', eventController.getEventDetails);

// Admin/protected routes
router.post('/create', upload.single('image'), createEvent);
router.get('/all', getAllEvents);
router.get('/:id', getEventById);
router.put('/:id', upload.single('image'), updateEvent);
router.delete('/:id', deleteEvent);

module.exports = router;