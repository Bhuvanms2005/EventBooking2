require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const adminRoutes = require('./routes/adminRoutes');
const eventRoutes = require('./routes/eventRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

app.use('/api/admin', adminRoutes);
app.use('/api/events', eventRoutes);

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({
        success: false,
        status,
        message
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});