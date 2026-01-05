import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Ticket, Calendar, MapPin, Clock, ArrowLeft, Download, ExternalLink, ChevronRight } from 'lucide-react';
import '../styles/MyBookings.css';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserBookings();
    }, []);

    const fetchUserBookings = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/bookings/my`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBookings(res.data);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            if (err.response?.status === 401) navigate('/login');
        }
    };

    if (loading) return <div className="loading-screen">Fetching your tickets...</div>;

    return (
        <div className="my-bookings-container">
            <nav className="user-nav">
                <div className="nav-content">
                    <Link to="/" className="nav-logo-area">
                        <Ticket color="#ffbd2e" fill="#ffbd2e" size={28} />
                        <span className="nav-logo">EventPro</span>
                    </Link>
                    <div className="nav-links-center">
                        <Link to="/">Home</Link>
                        <Link to="/events">Events</Link>
                        <Link to="/my-bookings" className="active">My Bookings</Link>
                    </div>
                </div>
            </nav>

            <header className="bookings-header">
                <div className="header-content">
                    <h1>My <span className="highlight">Bookings</span></h1>
                    <p>Manage your tickets and upcoming experiences</p>
                </div>
            </header>

            <main className="bookings-content">
                {bookings.length === 0 ? (
                    <div className="empty-bookings">
                        <Ticket size={60} color="#e2e8f0" />
                        <h3>No bookings found</h3>
                        <p>Looks like you haven't booked any events yet.</p>
                        <Link to="/events" className="explore-btn">Explore Events</Link>
                    </div>
                ) : (
                    <div className="bookings-grid">
                        {bookings.map((booking) => (
                            <div key={booking._id} className="ticket-card">
                                <div className="ticket-img">
                                    <img src={booking.event?.image} alt={booking.event?.title} />
                                    <div className={`status-badge ${booking.status.toLowerCase()}`}>
                                        {booking.status}
                                    </div>
                                </div>
                                <div className="ticket-info">
                                    <span className="category-label">{booking.event?.category}</span>
                                    <h3>{booking.event?.title}</h3>
                                    <div className="info-row">
                                        <Calendar size={16} />
                                        <span>{new Date(booking.event?.date).toLocaleDateString('en-GB')}</span>
                                    </div>
                                    <div className="info-row">
                                        <MapPin size={16} />
                                        <span>{booking.event?.location}</span>
                                    </div>
                                    <div className="ticket-footer">
                                        <div className="seats-count">
                                            <strong>{booking.ticketCount}</strong> Seats
                                        </div>
                                        <div className="price-paid">
                                            Paid: <strong>₹{booking.totalPrice}</strong>
                                        </div>
                                    </div>
                                    <div className="ticket-actions">
                                        <button className="action-btn download">
                                            <Download size={18} /> Download Ticket
                                        </button>
                                        <Link to={`/event/${booking.event?._id}`} className="action-btn view">
                                            Event Details <ChevronRight size={18} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default MyBookings;