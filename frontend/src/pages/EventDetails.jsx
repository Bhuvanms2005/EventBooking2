import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link, NavLink, useLocation } from 'react-router-dom';
import { Ticket, Calendar, MapPin, Shield, Zap, Headphones, Clock, ArrowLeft, Menu, X, ArrowRight, Users } from 'lucide-react';
import '../App.css';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    axios.get(`${import.meta.env.VITE_API_URL}/events/public/${id}`)
      .then(res => { setData(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const handleBookingClick = () => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login', { state: { from: location } });
    else navigate(`/checkout/${id}`);
  };

  if (loading) return <div className="loading-screen">Loading event...</div>;
  if (!data?.event) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-secondary)' }}>Event not found</h2>
      <Link to="/events" className="btn-primary">Browse Events</Link>
    </div>
  );

  const { event, related } = data;
  const imgBase = import.meta.env.VITE_API_URL.replace('/api', '');
  const ticketsBooked = event.capacity - event.availableTickets;
  const percentFull = Math.round((ticketsBooked / event.capacity) * 100);

  return (
    <div className="page-wrapper">
      <nav className="main-nav">
        <div className="nav-inner">
          <Link to="/" className="nav-brand"><Ticket size={20} color="#5b47e0" fill="#5b47e0"/>Event<span className="dot">Pro</span></Link>
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
      </div>

      <div className="breadcrumb">
        <Link to="/">Home</Link><span className="sep">/</span>
        <Link to="/events">Events</Link><span className="sep">/</span>
        <span>{event.title}</span>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 5%', display: 'grid', gridTemplateColumns: '1fr 360px', gap: '32px', alignItems: 'start' }}>
        {/* Left */}
        <div>
          <button onClick={() => navigate('/events')} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500', marginBottom: '20px', fontFamily: 'var(--font-body)', padding: 0 }}>
            <ArrowLeft size={17}/> Back to Events
          </button>

          <img src={`${imgBase}${event.image}`} alt={event.title} style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '16px', marginBottom: '28px', display: 'block' }} onError={e => e.target.src='https://via.placeholder.com/800x400?text=Event'} />

          <span style={{ background: 'var(--accent-soft)', color: 'var(--accent)', padding: '5px 14px', borderRadius: '9999px', fontSize: '0.82rem', fontWeight: '600', fontFamily: 'var(--font-display)', display: 'inline-block', marginBottom: '14px' }}>{event.category}</span>
          
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: '800', lineHeight: '1.2', marginBottom: '20px', color: 'var(--text-primary)' }}>{event.title}</h1>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '32px' }}>
            {[
              { icon: <Calendar size={16} color="#5b47e0"/>, label: 'Date', val: new Date(event.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) },
              { icon: <Clock size={16} color="#5b47e0"/>, label: 'Timing', val: `${event.startTime} – ${event.endTime}` },
              { icon: <MapPin size={16} color="#5b47e0"/>, label: 'Venue', val: event.location },
              { icon: <Users size={16} color="#5b47e0"/>, label: 'Capacity', val: `${event.capacity} total seats` },
            ].map((m, i) => (
              <div key={i} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ background: 'var(--accent-soft)', padding: '8px', borderRadius: '8px', flexShrink: 0 }}>{m.icon}</div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: 'var(--font-display)', marginBottom: '4px' }}>{m.label}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>{m.val}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: '700', marginBottom: '16px' }}>About this Event</h2>
            <div style={{ fontSize: '0.95rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
              {event.description?.split('\n').map((para, i) => para.trim() && <p key={i} style={{ marginBottom: '12px' }}>{para}</p>)}
            </div>
          </div>
        </div>

        {/* Right - Booking card */}
        <div style={{ position: 'sticky', top: 'calc(var(--nav-height) + 20px)' }}>
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid var(--border-subtle)' }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '500', marginBottom: '4px' }}>Price per ticket</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)' }}>₹{event.price.toLocaleString('en-IN')}</div>
              </div>
              <span style={{ background: event.status === 'Upcoming' ? 'var(--success-light)' : 'var(--error-light)', color: event.status === 'Upcoming' ? 'var(--success)' : 'var(--error)', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: '600' }}>{event.status}</span>
            </div>

            {[
              ['Date', new Date(event.date).toLocaleDateString('en-GB')],
              ['Time', `${event.startTime} – ${event.endTime}`],
              ['Venue', event.location],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.88rem' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: '500' }}>{k}</span>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)', textAlign: 'right', maxWidth: '180px' }}>{v}</span>
              </div>
            ))}

            {/* Availability bar */}
            <div style={{ margin: '16px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Availability</span>
                <span style={{ fontWeight: '600', color: event.availableTickets < 20 ? '#dc2626' : 'var(--success)' }}>
                  {event.availableTickets > 0 ? `${event.availableTickets} seats left` : 'Sold Out'}
                </span>
              </div>
              <div style={{ height: '6px', background: 'var(--border)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${percentFull}%`, background: percentFull > 80 ? '#dc2626' : 'var(--success)', borderRadius: '9999px', transition: 'width 0.3s' }}/>
              </div>
            </div>

            <button onClick={handleBookingClick} disabled={event.availableTickets === 0} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', borderRadius: '12px', fontSize: '1rem', fontFamily: 'var(--font-display)', marginBottom: '12px', opacity: event.availableTickets === 0 ? 0.5 : 1, cursor: event.availableTickets === 0 ? 'not-allowed' : 'pointer' }}>
              {event.availableTickets === 0 ? 'Sold Out' : 'Book Tickets'}
            </button>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
              {[{ icon: <Shield size={14}/>, label: 'Secure' }, { icon: <Zap size={14}/>, label: 'Instant' }, { icon: <Headphones size={14}/>, label: '24/7' }].map(({ icon, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>{icon}{label}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related?.length > 0 && (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 5% 60px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: '800', marginBottom: '24px' }}>You Might Also Like</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {related.map(rel => (
              <div key={rel._id} className="event-card" style={{ cursor: 'pointer' }} onClick={() => { navigate(`/event/${rel._id}`); window.scrollTo(0,0); }}>
                <img src={`${imgBase}${rel.image}`} alt={rel.title} className="card-img" onError={e => e.target.src='https://via.placeholder.com/400x200?text=Event'}/>
                <div className="card-body">
                  <span className="cat-tag">{rel.category}</span>
                  <h3>{rel.title}</h3>
                  <div className="meta">
                    <div className="meta-item"><MapPin size={13} color="#9ca3af"/>{rel.location}</div>
                  </div>
                  <div className="card-footer">
                    <span className="price">₹{rel.price.toLocaleString('en-IN')}</span>
                    <ArrowRight size={18} color="#5b47e0"/>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;