const Event = require('../models/Event');
const mongoose = require('mongoose');

exports.createEvent = async (req, res) => {
    try {
        const eventData = req.body;
        
        if (req.file) {
            eventData.image = `http://localhost:5000/uploads/${req.file.filename}`;
        }

        const newEvent = new Event({
            ...eventData,
            price: Math.round(Number(eventData.price)),
            availableTickets: Number(eventData.capacity)
        });

        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error: Could not save event." });
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