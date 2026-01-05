const multer = require('multer');
const path = require('path');

// Configure how files are stored
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // This points to your 'uploads' folder in the backend root
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        // Creates a unique name: timestamp + original extension
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

module.exports = upload;