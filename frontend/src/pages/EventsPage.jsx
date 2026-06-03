import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, NavLink } from 'react-router-dom';
import { Ticket, Search, MapPin, Calendar, SlidersHorizontal, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import '../App.css';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [filters, setFilters] = useState({ keyword: '', city: '', category: '', dateFrom: '', dateTo: '' });
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      axios.get(`${import.meta.env.VITE_API_URL}/events/public/categories`),
      axios.get(`${import.meta.env.VITE_API_URL}/events/public/cities`)
    ]).then(([catRes, cityRes]) => {
      setCategories(catRes.data);
      setCities(cityRes.data);
    });
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [currentPage]);

  const fetchEvents = async (resetPage = false) => {
    setLoading(true);
    const page = resetPage ? 1 : currentPage;
    if (resetPage) setCurrentPage(1);
    try {
      const params = new URLSearchParams({ ...filters, page, limit: 9 });
      Object.keys(filters).forEach(k => !filters[k] && params.delete(k));
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/events/public/filter?${params}`);
      setEvents(res.data.events);
      setTotalPages(res.data.totalPages);
      setTotalEvents(res.data.totalEvents);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => { e.preventDefault(); fetchEvents(true); };
  const clearFilters = () => { setFilters({ keyword: '', city: '', category: '', dateFrom: '', dateTo: '' }); setTimeout(() => fetchEvents(true), 0); };
  const imgBase = import.meta.env.VITE_API_URL.replace('/api', '');

  return (
    <div className="page-wrapper">
      <nav className="main-nav">
        <div className="nav-inner">
          <Link to="/" className="nav-brand"><Ticket size={20} color="#5b47e0" fill="#5b47e0" />Event<span className="dot">Pro</span></Link>
          <div className="nav-links">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/events">Events</NavLink>
            <NavLink to="/my-bookings">My Bookings</NavLink>
            <NavLink to="/about">About</NavLink>
          </div>
          <div className="nav-cta">
            <Link to="/login" className="btn-primary">Sign In</Link>
            <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X size={22}/> : <Menu size={22}/>}</button>
          </div>
        </div>
      </nav>
      <div className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
        <NavLink to="/" end onClick={() => setIsMenuOpen(false)}>Home</NavLink>
        <NavLink to="/events" onClick={() => setIsMenuOpen(false)}>Events</NavLink>
        <NavLink to="/my-bookings" onClick={() => setIsMenuOpen(false)}>My Bookings</NavLink>
        <NavLink to="/about" onClick={() => setIsMenuOpen(false)}>About</NavLink>
      </div>

      {/* Header */}
      <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--border)', padding: '32px 5%' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: '800', marginBottom: '6px' }}>All Events</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{totalEvents} events available</p>
        </div>
      </div>

      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '32px 5%', display: 'grid', gridTemplateColumns: '260px 1fr', gap: '32px', alignItems: 'start' }}>
        {/* Sidebar Filters */}
        <aside style={{ background: 'var(--white)', borderRadius: '16px', border: '1px solid var(--border)', padding: '24px', position: 'sticky', top: 'calc(var(--nav-height) + 20px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}><SlidersHorizontal size={16} color="#5b47e0"/> Filters</h3>
            <button onClick={clearFilters} style={{ fontSize: '0.8rem', color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500' }}>Clear all</button>
          </div>

          <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <FilterGroup label="Search">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg)', borderRadius: '10px', border: '1px solid var(--border)', padding: '10px 14px' }}>
                <Search size={15} color="#9ca3af"/>
                <input type="text" placeholder="Keyword..." value={filters.keyword} onChange={e => setFilters({...filters, keyword: e.target.value})} style={{ background: 'none', border: 'none', outline: 'none', width: '100%', fontSize: '0.88rem', fontFamily: 'var(--font-body)' }} />
              </div>
            </FilterGroup>

            <FilterGroup label="Category">
              <select value={filters.category} onChange={e => setFilters({...filters, category: e.target.value})} style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', padding: '10px 14px', fontSize: '0.88rem', fontFamily: 'var(--font-body)', outline: 'none', color: 'var(--text-primary)' }}>
                <option value="">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </FilterGroup>

            <FilterGroup label="City">
              <select value={filters.city} onChange={e => setFilters({...filters, city: e.target.value})} style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', padding: '10px 14px', fontSize: '0.88rem', fontFamily: 'var(--font-body)', outline: 'none', color: 'var(--text-primary)' }}>
                <option value="">All Cities</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </FilterGroup>

            <FilterGroup label="Date Range">
              <input type="date" value={filters.dateFrom} onChange={e => setFilters({...filters, dateFrom: e.target.value})} style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', padding: '10px 14px', fontSize: '0.88rem', fontFamily: 'var(--font-body)', outline: 'none', marginBottom: '8px', color: 'var(--text-primary)' }} placeholder="From" />
              <input type="date" value={filters.dateTo} onChange={e => setFilters({...filters, dateTo: e.target.value})} style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', padding: '10px 14px', fontSize: '0.88rem', fontFamily: 'var(--font-body)', outline: 'none', color: 'var(--text-primary)' }} placeholder="To" />
            </FilterGroup>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '11px', borderRadius: '10px' }}>Apply Filters</button>
          </form>
        </aside>

        {/* Events Grid */}
        <div>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {[1,2,3,4,5,6].map(i => (
                <div key={i} style={{ background: 'var(--white)', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                  <div style={{ height: '180px', background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }}/>
                  <div style={{ padding: '20px' }}>
                    <div style={{ height: '12px', background: '#f3f4f6', borderRadius: '6px', marginBottom: '12px', width: '60%' }}/>
                    <div style={{ height: '20px', background: '#f3f4f6', borderRadius: '6px', marginBottom: '8px' }}/>
                    <div style={{ height: '12px', background: '#f3f4f6', borderRadius: '6px', width: '80%' }}/>
                  </div>
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--white)', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <Ticket size={40} color="#e5e7eb" style={{ margin: '0 auto 12px' }}/>
              <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-secondary)', marginBottom: '8px' }}>No events found</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Try adjusting your filters</p>
              <button onClick={clearFilters} className="btn-primary" style={{ marginTop: '16px' }}>Clear Filters</button>
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                {events.map(event => (
                  <div key={event._id} className="event-card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/event/${event._id}`)}>
                    <img src={`${imgBase}${event.image}`} alt={event.title} className="card-img" onError={e => e.target.src='https://via.placeholder.com/400x200?text=Event'} />
                    <div className="card-body">
                      <span className="cat-tag">{event.category}</span>
                      <h3>{event.title}</h3>
                      <div className="meta">
                        <div className="meta-item"><Calendar size={13} color="#9ca3af"/>{new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                        <div className="meta-item"><MapPin size={13} color="#9ca3af"/>{event.location}</div>
                      </div>
                      <div className="card-footer">
                        <span className="price">₹{event.price.toLocaleString('en-IN')}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: event.availableTickets < 10 ? '#dc2626' : 'var(--text-muted)' }}>
                          {event.availableTickets > 0 ? `${event.availableTickets} left` : 'Sold Out'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--white)', color: currentPage === 1 ? 'var(--text-muted)' : 'var(--text-primary)', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontSize: '0.88rem', fontWeight: '500', fontFamily: 'var(--font-body)' }}>
                    <ChevronLeft size={16}/> Previous
                  </button>
                  <span style={{ padding: '8px 16px', background: 'var(--accent)', color: 'white', borderRadius: '10px', fontSize: '0.88rem', fontWeight: '600', fontFamily: 'var(--font-display)' }}>{currentPage} / {totalPages}</span>
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--white)', color: currentPage === totalPages ? 'var(--text-muted)' : 'var(--text-primary)', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontSize: '0.88rem', fontWeight: '500', fontFamily: 'var(--font-body)' }}>
                    Next <ChevronRight size={16}/>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const FilterGroup = ({ label, children }) => (
  <div>
    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
    {children}
  </div>
);

export default EventsPage;