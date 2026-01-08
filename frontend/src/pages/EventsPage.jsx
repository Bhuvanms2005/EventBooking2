import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
    Ticket, Search, MapPin, Calendar, Filter, 
    ChevronRight, ChevronLeft, Menu, X 
} from 'lucide-react';
import '../styles/EventsPage.css';

const EventsPage = () => {
    const [events, setEvents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ current: 1, total: 1 });
    
    const [filters, setFilters] = useState({
        keyword: '',
        city: '',
        category: '',
        dateFrom: '',
        dateTo: ''
    });
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchInitialFilters();
        fetchEvents();
    }, [pagination.current]);

    const fetchInitialFilters = async () => {
        try {
            const [cityRes, catRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL}/events/public/cities`),
                axios.get(`${import.meta.env.VITE_API_URL}/events/public/categories`)
            ]);
            setCities(cityRes.data);
            setCategories(catRes.data);
        } catch (err) { console.error(err); }
    };

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const params = { ...filters, page: pagination.current };
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/events/public/filter`, { params });
            setEvents(res.data.events);
            setPagination({ ...pagination, total: res.data.totalPages });
            setLoading(false);
        } catch (err) { setLoading(false); }
    };

    const handleApplyFilters = (e) => {
        if(e) e.preventDefault();
        setPagination({ ...pagination, current: 1 });
        fetchEvents();
    };

    return (
        <div className="events-page-container">
            <nav className="user-nav">
                <div className="nav-content">
                    <Link to="/" className="nav-logo-area">
                        <Ticket color="#ffbd2e" fill="#ffbd2e" size={28} />
                        <span className="nav-logo">EventPro</span>
                    </Link>
                    
                    <div className={`nav-links-center ${isMenuOpen ? 'open' : ''}`}>
                        <NavLink to="/" onClick={() => setIsMenuOpen(false)}>Home</NavLink>
                        <NavLink to="/events" className="active" onClick={() => setIsMenuOpen(false)}>Events</NavLink>
                        <NavLink to="/my-bookings" onClick={() => setIsMenuOpen(false)}>My Bookings</NavLink>
                        <NavLink to="/about" onClick={() => setIsMenuOpen(false)}>About</NavLink>
                    </div>

                    <div className="nav-right-actions">
                        <NavLink to="/login" className="login-pill">Login / Profile</NavLink>
                        
                        <button className="mobile-menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X size={28} color="white"/> : <Menu size={28} color="white"/>}
                        </button>
                    </div>
                </div>
            </nav>

            <header className="page-header">
                <h1>Explore <span className="highlight">All Events</span></h1>
                <p>Find the best experiences across India</p>
            </header>

            <div className="search-strip">
                <div className="search-bar-rounded">
                    <div className="input-box">
                        <Search size={18} color="#6366f1"/>
                        <input 
                            type="text" 
                            placeholder="Search event name..." 
                            onChange={(e) => setFilters({...filters, keyword: e.target.value})}
                        />
                    </div>
                    <div className="input-box">
                        <MapPin size={18} color="#6366f1"/>
                        <select onChange={(e) => setFilters({...filters, city: e.target.value})}>
                            <option value="">All Cities</option>
                            {cities.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <button className="search-trigger-btn" onClick={handleApplyFilters}>Search</button>
                </div>
            </div>

            <main className="events-layout">
                <aside className="filter-sidebar">
                    <div className="sidebar-card">
                        <div className="side-header">
                            <Filter size={18} />
                            <h3>Filter By</h3>
                        </div>

                        <div className="filter-group">
                            <h4>Category</h4>
                            {categories.map(cat => (
                                <label key={cat} className="check-item">
                                    <input 
                                        type="checkbox" 
                                        checked={filters.category === cat}
                                        onChange={() => setFilters({...filters, category: filters.category === cat ? '' : cat})}
                                    />
                                    <span>{cat}</span>
                                </label>
                            ))}
                        </div>

                        <div className="filter-group">
                            <h4>Date Range</h4>
                            <input type="date" className="date-inp" onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}/>
                            <span className="to-txt">to</span>
                            <input type="date" className="date-inp" onChange={(e) => setFilters({...filters, dateTo: e.target.value})}/>
                        </div>

                        <button className="apply-side-btn" onClick={handleApplyFilters}>Apply Filters</button>
                    </div>
                </aside>

                <section className="listing-content">
                    {loading ? (
                        <div className="shimmer-container">Loading exciting events...</div>
                    ) : (
                        <>
                            <div className="grid-container">
                                {events.length > 0 ? (
                                    events.map(event => (
                                        <div key={event._id} className="event-item-card">
                                            <div className="item-img">
                                                <img
  src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${event.image}`}
  alt={event.title}
  className="event-thumb"
/>
                                                <div className="item-price">₹{event.price}</div>
                                            </div>
                                            <div className="item-details">
                                                <h3>{event.title}</h3>
                                                <p><Calendar size={14}/> {new Date(event.date).toLocaleDateString('en-GB')}</p>
                                                <p><MapPin size={14}/> {event.location}</p>
                                                <button 
                                                    onClick={() => navigate(`/event/${event._id}`)} 
                                                    className="book-btn"
                                                >
                                                    Book Now
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-results">No events match your current filters.</div>
                                )}
                            </div>

                            <div className="pagination-bar">
                                <button 
                                    disabled={pagination.current === 1}
                                    onClick={() => setPagination({...pagination, current: pagination.current - 1})}
                                >
                                    <ChevronLeft size={20}/>
                                </button>
                                <span>Page {pagination.current} of {pagination.total || 1}</span>
                                <button 
                                    disabled={pagination.current === pagination.total || pagination.total === 0}
                                    onClick={() => setPagination({...pagination, current: pagination.current + 1})}
                                >
                                    <ChevronRight size={20}/>
                                </button>
                            </div>
                        </>
                    )}
                </section>
            </main>
        </div>
    );
};

export default EventsPage;