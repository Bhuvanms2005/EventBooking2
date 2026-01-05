import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link, NavLink, useLocation } from 'react-router-dom';
import { 
    Ticket, Calendar, MapPin, ShieldCheck, Zap, 
    Headphones, Clock, Share2, ArrowLeft, Menu, X, ArrowRight 
} from 'lucide-react';
import '../styles/EventDetails.css';

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchEventDetails();
    }, [id]);

    const fetchEventDetails = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/events/public/${id}`);
            setData(res.data);
            setLoading(false);
        } catch (err) {
            setLoading(false);
        }
    };

    const handleBookingClick = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            // We pass the current location so the login page knows where to send the user back
            navigate('/login', { state: { from: location } });
        } else {
            navigate(`/checkout/${id}`);
        }
    };

    if (loading) return <div className="loading-screen">Preparing your experience...</div>;
    if (!data?.event) return <div className="error-screen">Event not found.</div>;

    const { event, related } = data;

    return (
        <div className="details-page-container">
            <nav className="user-nav">
                <div className="nav-content">
                    <Link to="/" className="nav-logo-area">
                        <Ticket color="#ffbd2e" fill="#ffbd2e" size={28} />
                        <span className="nav-logo">EventPro</span>
                    </Link>
                    <div className={`nav-links-center ${isMenuOpen ? 'open' : ''}`}>
                        <NavLink to="/" onClick={() => setIsMenuOpen(false)}>Home</NavLink>
                        <NavLink to="/events" onClick={() => setIsMenuOpen(false)}>Events</NavLink>
                        <NavLink to="/my-bookings" onClick={() => setIsMenuOpen(false)}>My Bookings</NavLink>
                        <NavLink to="/about" onClick={() => setIsMenuOpen(false)}>About</NavLink>
                    </div>
                    <div className="nav-right-actions">
                        {/* CHANGED TO NAVLINK */}
                        <NavLink to="/login" className="login-pill">Login / Profile</NavLink>
                        <button className="mobile-menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X size={28} color="white"/> : <Menu size={28} color="white"/>}
                        </button>
                    </div>
                </div>
            </nav>

            <div className="breadcrumb-area">
                <Link to="/">Home</Link> &nbsp; / &nbsp; <Link to="/events">Events</Link> &nbsp; / &nbsp; <span>Details</span>
            </div>

            <main className="details-layout">
                <div className="details-left">
                    <div className="hero-card">
                        <img src={event.image} alt={event.title} className="event-banner" />
                        <div className="hero-info">
                            <span className="category-tag">{event.category}</span>
                            <h1>{event.title}</h1>
                            <div className="meta-grid">
                                <div className="meta-item"><Calendar size={18}/> {new Date(event.date).toLocaleDateString('en-GB')}</div>
                                <div className="meta-item"><Clock size={18}/> {event.startTime} - {event.endTime}</div>
                                <div className="meta-item"><MapPin size={18}/> {event.location}</div>
                                <div className="meta-item"><Ticket size={18}/> ₹{event.price} onwards</div>
                            </div>
                        </div>
                    </div>

                    <div className="description-section">
                        <h3>About the Event</h3>
                        <div className="rich-text">
                            {event.description?.split('\n').map((para, i) => (
                                <p key={i}>{para}</p>
                            ))}
                        </div>
                    </div>
                </div>

                <aside className="details-right">
                    <div className="booking-card">
                        <h3>Event Summary</h3>
                        <div className="summary-list">
                            <div className="summary-item">
                                <span>Date</span>
                                <strong>{new Date(event.date).toLocaleDateString('en-GB')}</strong>
                            </div>
                            <div className="summary-item">
                                <span>Timing</span>
                                <strong>{event.startTime} - {event.endTime}</strong>
                            </div>
                            <div className="summary-item">
                                <span>Venue</span>
                                <strong>{event.location}</strong>
                            </div>
                            <div className="summary-item">
                                <span>Availability</span>
                                <strong className={event.availableTickets < 10 ? "low-stock" : ""}>
                                    {event.availableTickets > 0 ? `${event.availableTickets} Seats left` : "Sold Out"}
                                </strong>
                            </div>
                            <div className="summary-item">
                                <span>Price Per Seat</span>
                                <strong className="price-txt">₹{event.price}</strong>
                            </div>
                        </div>

                        <button 
                            className="book-now-main-btn"
                            onClick={handleBookingClick}
                        >
                            Book Tickets Now
                        </button>

                        <div className="trust-badges">
                            <div className="badge"><ShieldCheck size={16}/> Secure</div>
                            <div className="badge"><Zap size={16}/> Instant</div>
                            <div className="badge"><Headphones size={16}/> 24/7</div>
                        </div>
                    </div>
                </aside>
            </main>

            {related.length > 0 && (
                <section className="related-section">
                    <h2>You Might Also Like</h2>
                    <div className="related-grid">
                        {related.map(rel => (
                            <div key={rel._id} className="related-card" onClick={() => navigate(`/event/${rel._id}`)}>
                                <img src={rel.image} alt={rel.title} />
                                <div className="rel-body">
                                    <h4>{rel.title}</h4>
                                    <p><MapPin size={14}/> {rel.location}</p>
                                    <div className="rel-footer">
                                        <strong>₹{rel.price}</strong>
                                        <ArrowRight size={18} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default EventDetails;