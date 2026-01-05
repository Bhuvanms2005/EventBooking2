import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, NavLink } from 'react-router-dom';
import { 
    Ticket, Search, MapPin, Calendar, 
    ShieldCheck, Zap, Headphones, ArrowRight, Menu, X 
} from 'lucide-react';
import '../styles/Home.css';

const Home = () => {
    const [allEvents, setAllEvents] = useState([]); 
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState({ keyword: '', city: '', date: '' });
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [eventsRes, citiesRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL}/events/public/all`),
                    axios.get(`${import.meta.env.VITE_API_URL}/events/public/cities`)
                ]);
                setAllEvents(eventsRes.data);
                setFilteredEvents(eventsRes.data);
                setCities(citiesRes.data);
                setLoading(false);
            } catch (err) {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    const handleSearch = (e) => {
        if(e) e.preventDefault();
        const term = searchQuery.keyword.toLowerCase().trim();
        const filtered = allEvents.filter(event => {
            const matchesKeyword = event.title.toLowerCase().includes(term) || 
                                 event.category.toLowerCase().includes(term);
            const matchesCity = searchQuery.city === "" || event.location === searchQuery.city;
            const matchesDate = searchQuery.date === "" || event.date.split('T')[0] === searchQuery.date;
            return matchesKeyword && matchesCity && matchesDate;
        });
        setFilteredEvents(filtered);
    };

    if (loading) return <div className="loading-screen">Bringing the stage to life...</div>;

    return (
        <div className="home-container">
            <nav className="user-nav">
                <div className="nav-content">
                    <Link to="/" className="nav-logo-area">
                        <Ticket color="#ffbd2e" fill="#ffbd2e" size={32} />
                        <span className="nav-logo">EventPro</span>
                    </Link>

                    <div className={`nav-links-center ${isMenuOpen ? 'open' : ''}`}>
                        <NavLink to="/" onClick={() => setIsMenuOpen(false)}>Home</NavLink>
                        <NavLink to="/events" onClick={() => setIsMenuOpen(false)}>Events</NavLink>
                        <NavLink to="/my-bookings" onClick={() => setIsMenuOpen(false)}>My Bookings</NavLink>
                        <NavLink to="/about" onClick={() => setIsMenuOpen(false)}>About</NavLink>
                    </div>

                    <div className="nav-right-actions">
                        <button onClick={() => navigate('/login')} className="login-pill">Login / Profile</button>
                        <button className="mobile-menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X size={28} color="white"/> : <Menu size={28} color="white"/>}
                        </button>
                    </div>
                </div>
            </nav>

            <section className="hero-section">
                <div className="hero-visual-bg">
                    <div className="circle-blob"></div>
                    <div className="circle-blob-2"></div>
                </div>
                <div className="hero-content">
                    <div className="hero-text-center">
                        <h1>Discover <span className="highlight">Unforgettable</span> Experiences</h1>
                        <p>Book tickets to the most exclusive concerts, festivals, and tech conferences worldwide.</p>
                    </div>
                </div>

                <div className="search-wrapper">
                    <div className="search-container">
                        <form className="search-form" onSubmit={handleSearch}>
                            <div className="search-group">
                                <Search size={20} color="#6366f1" />
                                <input 
                                    type="text" 
                                    placeholder="Search events..." 
                                    value={searchQuery.keyword}
                                    onChange={(e) => setSearchQuery({...searchQuery, keyword: e.target.value})}
                                />
                            </div>
                            <div className="search-group">
                                <MapPin size={20} color="#6366f1" />
                                <select 
                                    value={searchQuery.city}
                                    onChange={(e) => setSearchQuery({...searchQuery, city: e.target.value})}
                                >
                                    <option value="">Select City</option>
                                    {cities.map((city, index) => (
                                        <option key={index} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="search-group">
                                <Calendar size={20} color="#6366f1" />
                                <input 
                                    type="date" 
                                    value={searchQuery.date}
                                    onChange={(e) => setSearchQuery({...searchQuery, date: e.target.value})}
                                />
                            </div>
                            <button type="submit" className="search-btn">Find Events</button>
                        </form>
                    </div>
                </div>
            </section>

            <main className="main-feed">
                <div className="section-header">
                    <h2>{filteredEvents.length > 0 ? "Upcoming Events" : "No Results Found"}</h2>
                    <Link to="/events" className="view-all">View All <ArrowRight size={16}/></Link>
                </div>

                <div className="event-grid">
                    {filteredEvents.map(event => (
                        <div key={event._id} className="user-event-card">
                            <div className="card-img-wrapper">
                                <img src={event.image} alt={event.title} />
                                <span className="card-cat">{event.category}</span>
                            </div>
                            <div className="card-body">
                                <h3>{event.title}</h3>
                                <div className="card-meta">
                                    <span><Calendar size={14}/> {new Date(event.date).toLocaleDateString('en-GB')}</span>
                                    <span><MapPin size={14}/> {event.location}</span>
                                </div>
                                <div className="card-footer">
                                    <span className="card-price">₹{Math.round(event.price)}</span>
                                    <button 
    onClick={() => navigate(`/event/${event._id}`)} 
    className="book-btn"
>
    Book Now
</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <section className="features-strip">
                    <div className="feature-card">
                        <div className="feature-icon"><Zap size={24} /></div>
                        <div className="feature-info">
                            <h4>Easy Booking</h4>
                            <p>Fast & reliable ticketing</p>
                        </div>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon"><ShieldCheck size={24} /></div>
                        <div className="feature-info">
                            <h4>Secure Payments</h4>
                            <p>100% encrypted Checkout</p>
                        </div>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon"><Headphones size={24} /></div>
                        <div className="feature-info">
                            <h4>24/7 Support</h4>
                            <p>Dedicated help desk</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Home;