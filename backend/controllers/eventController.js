const Event = require('../models/Event');
const mongoose = require('mongoose');

exports.createEvent = async (req, res) => {
    try {
        const eventData = req.body;
        
        if (req.file) {
            eventData.image = `http://localhost:5000/uploads/${req.file.filename}`;
        }

        // Convert strings to numbers to ensure math operations work later
        const ticketCapacity = Number(eventData.capacity);
        const ticketPrice = Math.round(Number(eventData.price));

        const newEvent = new Event({
            ...eventData,
            price: ticketPrice,
            capacity: ticketCapacity,
            // Ensure this is explicitly set to match capacity on creation
            availableTickets: ticketCapacity 
        });

        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (err) {
        console.error("Create Event Error:", err); // Helps you debug in the console
        res.status(500).json({ 
            message: "Internal Server Error: Ensure all required fields (including timings) are provided." 
        });
    }
};

exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ createdAt: -1 });
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: "Error fetching events" });
    }
};

exports.getEventById = async (req, res) => {
    try {
        const { id } = req.params;

        if (id === 'new') {
            return res.json({ 
                event: {
                    title: '', description: '', date: '', startTime: '', endTime: '',
                    location: '', category: 'Concerts', price: '', capacity: '', 
                    status: 'Upcoming'
                }, 
                analytics: { ticketsBooked: 0, revenue: 0 } 
            });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const event = await Event.findById(id);
        if (!event) return res.status(404).json({ message: "Event not found" });
        
        const analytics = {
            ticketsBooked: event.capacity - event.availableTickets,
            revenue: (event.capacity - event.availableTickets) * event.price,
        };
        res.json({ event, analytics });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const updatedData = req.body;
        if (req.file) {
            updatedData.image = `http://localhost:5000/uploads/${req.file.filename}`;
        }

        const updatedEvent = await Event.findByIdAndUpdate(id, updatedData, { new: true });
        res.json(updatedEvent);
    } catch (err) {
        res.status(500).json({ message: "Update Failed" });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        await Event.findByIdAndDelete(id);
        res.json({ message: "Event Deleted Successfully" });
    } catch (err) {
        res.status(500).json({ message: "Delete Failed" });
    }
};
exports.getUniqueCities = async (req, res) => {
    try {
        const cities = await Event.distinct('location');
        res.json(cities);
    } catch (err) {
        res.status(500).json({ message: "Error fetching cities" });
    }
};
exports.getFilteredEvents = async (req, res) => {
    try {
        const { keyword, city, category, dateFrom, dateTo, page = 1, limit = 9 } = req.query;
        let query = {};

        if (keyword) query.title = { $regex: keyword, $options: 'i' };
        if (city) query.location = city;
        if (category) query.category = category;
        if (dateFrom || dateTo) {
            query.date = {};
            if (dateFrom) query.date.$gte = new Date(dateFrom);
            if (dateTo) query.date.$lte = new Date(dateTo);
        }

        const skip = (page - 1) * limit;
        const total = await Event.countDocuments(query);
        const events = await Event.find(query).sort({ date: 1 }).skip(skip).limit(Number(limit));

        res.json({
            events,
            totalPages: Math.ceil(total / limit),
            currentPage: Number(page),
            totalEvents: total
        });
    } catch (err) {
        res.status(500).json({ message: "Error filtering events" });
    }
};
exports.getUniqueCategories = async (req, res) => {
    try {
        const categories = await Event.distinct('category');
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: "Error fetching categories" });
    }
};
exports.getEventDetails = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: "Event not found" });

        // Fetch 3 related events from the same category, excluding the current one
        const related = await Event.find({ 
            category: event.category, 
            _id: { $ne: event._id } 
        }).limit(3);

        res.json({ event, related });
    } catch (err) {
        res.status(500).json({ message: "Error fetching event details" });
    }
};