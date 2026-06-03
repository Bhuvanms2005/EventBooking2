import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, NavLink } from 'react-router-dom';
import { Ticket, Search, MapPin, Calendar, Shield, Zap, Headphones, ArrowRight, Menu, X, ChevronRight } from 'lucide-react';
import '../App.css';

const Navbar = ({ isMenuOpen, setIsMenuOpen }) => (
  <>
    <nav className="main-nav">
      <div className="nav-inner">
        <Link to="/" className="nav-brand">
          <Ticket size={22} color="#5b47e0" fill="#5b47e0" />
          Event<span className="dot">Pro</span>
        </Link>
        <div className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/events">Events</NavLink>
          <NavLink to="/my-bookings">My Bookings</NavLink>
          <NavLink to="/about">About</NavLink>
        </div>
        <div className="nav-cta">
          <Link to="/login" className="btn-primary">Sign In</Link>
          <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </nav>
    <div className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
      <NavLink to="/" end onClick={() => setIsMenuOpen(false)}>Home</NavLink>
      <NavLink to="/events" onClick={() => setIsMenuOpen(false)}>Events</NavLink>
      <NavLink to="/my-bookings" onClick={() => setIsMenuOpen(false)}>My Bookings</NavLink>
      <NavLink to="/about" onClick={() => setIsMenuOpen(false)}>About</NavLink>
      <Link to="/login" className="btn-primary" style={{marginTop: '8px', justifyContent: 'center'}} onClick={() => setIsMenuOpen(false)}>Sign In</Link>
    </div>
  </>
);

const Home = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState({ keyword: '', city: '', date: '' });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, citiesRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/events/public/all`),
          axios.get(`${import.meta.env.VITE_API_URL}/events/public/cities`)
        ]);
        setAllEvents(eventsRes.data);
        setFilteredEvents(eventsRes.data.slice(0, 6));
        setCities(citiesRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const term = searchQuery.keyword.toLowerCase().trim();
    const filtered = allEvents.filter(event => {
      const matchesKeyword = !term || event.title.toLowerCase().includes(term) || event.category.toLowerCase().includes(term);
      const matchesCity = !searchQuery.city || event.location === searchQuery.city;
      const matchesDate = !searchQuery.date || event.date?.split('T')[0] === searchQuery.date;
      return matchesKeyword && matchesCity && matchesDate;
    });
    setFilteredEvents(filtered.slice(0, 6));
  };

  if (loading) return <div className="loading-screen">Loading events...</div>;

  const imgBase = import.meta.env.VITE_API_URL.replace('/api', '');

  return (
    <div className="page-wrapper">
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #fafafa 0%, #f0ecff 50%, #f9fafb 100%)', padding: '80px 5% 120px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-100px', right: '-80px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(91,71,224,0.07) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-60px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(91,71,224,0.08)', border: '1px solid rgba(91,71,224,0.15)', padding: '6px 16px', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: '600', color: '#5b47e0', marginBottom: '28px', fontFamily: 'var(--font-display)' }}>
            <Ticket size={14} /> Discover & Book Events
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontWeight: '800', lineHeight: '1.15', color: 'var(--text-primary)', marginBottom: '20px' }}>
            Find Your Next<br /><span style={{ color: '#5b47e0' }}>Unforgettable</span> Experience
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto 48px', lineHeight: '1.7' }}>
            Concerts, festivals, workshops, conferences — book tickets to experiences that matter.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} style={{ background: 'white', borderRadius: '16px', padding: '10px', boxShadow: '0 8px 40px rgba(0,0,0,0.1)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '8px', maxWidth: '860px', margin: '0 auto' }}>
            {[
              { icon: <Search size={17} color="#9ca3af" />, type: 'text', placeholder: 'Search events or categories...', val: searchQuery.keyword, key: 'keyword' },
              { icon: <MapPin size={17} color="#9ca3af" />, type: 'select', placeholder: 'All Cities', val: searchQuery.city, key: 'city' },
              { icon: <Calendar size={17} color="#9ca3af" />, type: 'date', placeholder: '', val: searchQuery.date, key: 'date' }
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f9fafb', borderRadius: '10px', padding: '12px 16px', border: '1px solid #e5e7eb', transition: 'border-color 0.2s' }}>
                {f.icon}
                {f.type === 'select' ? (
                  <select value={f.val} onChange={(e) => setSearchQuery({...searchQuery, [f.key]: e.target.value})} style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem', color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>
                    <option value="">All Cities</option>
                    {cities.map((city, ci) => <option key={ci} value={city}>{city}</option>)}
                  </select>
                ) : (
                  <input type={f.type} placeholder={f.placeholder} value={f.val} onChange={(e) => setSearchQuery({...searchQuery, [f.key]: e.target.value})} style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem', color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }} />
                )}
              </div>
            ))}
            <button type="submit" className="btn-primary" style={{ padding: '12px 24px', borderRadius: '10px', whiteSpace: 'nowrap', fontSize: '0.95rem' }}>
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Events Grid */}
      <main style={{ padding: '60px 5%', maxWidth: '1300px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)' }}>
              {filteredEvents.length > 0 ? 'Upcoming Events' : 'No Events Found'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>{filteredEvents.length} events available</p>
          </div>
          <Link to="/events" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#5b47e0', fontWeight: '600', fontSize: '0.9rem', fontFamily: 'var(--font-display)' }}>
            View all <ArrowRight size={16} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {filteredEvents.map(event => (
            <div key={event._id} className="event-card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/event/${event._id}`)}>
              <img src={`${imgBase}${event.image}`} alt={event.title} className="card-img" onError={(e) => e.target.src = 'https://via.placeholder.com/400x200?text=Event'} />
              <div className="card-body">
                <span className="cat-tag">{event.category}</span>
                <h3>{event.title}</h3>
                <div className="meta">
                  <div className="meta-item"><Calendar size={14} color="#9ca3af" /> {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                  <div className="meta-item"><MapPin size={14} color="#9ca3af" /> {event.location}</div>
                </div>
                <div className="card-footer">
                  <span className="price">₹{event.price.toLocaleString('en-IN')}</span>
                  <button className="btn-primary" style={{ fontSize: '0.85rem', padding: '8px 16px' }}>Book Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
            <Ticket size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>No events match your search</h3>
            <p style={{ fontSize: '0.9rem' }}>Try different keywords or browse all events</p>
            <button onClick={() => { setSearchQuery({ keyword: '', city: '', date: '' }); setFilteredEvents(allEvents.slice(0, 6)); }} className="btn-primary" style={{ marginTop: '20px' }}>Clear Filters</button>
          </div>
        )}
      </main>

      {/* Features strip */}
      <section style={{ background: 'var(--white)', borderTop: '1px solid var(--border)', padding: '60px 5%' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>
          {[
            { icon: <Zap size={22} color="#5b47e0" />, title: 'Instant Booking', desc: 'Book in seconds, get confirmed tickets immediately' },
            { icon: <Shield size={22} color="#5b47e0" />, title: 'Secure Payments', desc: '100% encrypted checkout. Your data is safe.' },
            { icon: <Headphones size={22} color="#5b47e0" />, title: '24/7 Support', desc: 'Dedicated help whenever you need it' }
          ].map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ background: 'var(--accent-soft)', padding: '12px', borderRadius: '12px', flexShrink: 0 }}>{f.icon}</div>
              <div>
                <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: '700', marginBottom: '6px' }}>{f.title}</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#111827', color: 'rgba(255,255,255,0.6)', padding: '40px 5%', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '1.2rem', color: 'white', marginBottom: '12px' }}>EventPro</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', fontSize: '0.85rem', flexWrap: 'wrap', marginBottom: '20px' }}>
          <Link to="/events" style={{ color: 'rgba(255,255,255,0.5)', transition: 'color 0.2s' }}>Events</Link>
          <Link to="/about" style={{ color: 'rgba(255,255,255,0.5)' }}>About</Link>
          <Link to="/terms" style={{ color: 'rgba(255,255,255,0.5)' }}>Terms & Privacy</Link>
          <a href="mailto:support@eventpro.com" style={{ color: 'rgba(255,255,255,0.5)' }}>Support</a>
        </div>
        <p style={{ fontSize: '0.8rem' }}>© 2025 EventPro. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;