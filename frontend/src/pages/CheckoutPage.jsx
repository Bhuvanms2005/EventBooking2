import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Ticket, MapPin, Calendar, User, Shield, ArrowLeft, Plus, Minus, CheckCircle, ArrowRight, Clock } from 'lucide-react';
import '../App.css';

const CheckoutPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [user] = useState(() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } });
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    axios.get(`${import.meta.env.VITE_API_URL}/events/public/${id}`)
      .then(res => { setEvent(res.data.event); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const handleBooking = async () => {
    setBookingLoading(true); setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/bookings/create`,
        { eventId: event._id, ticketCount: count, totalPrice: event.price * count },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookingId(res.data.booking?._id);
      setIsSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const imgBase = import.meta.env.VITE_API_URL.replace('/api', '');

  if (loading) return <div className="loading-screen">Loading...</div>;
  if (!event) return <div style={{ textAlign: 'center', padding: '80px', fontFamily: 'var(--font-display)' }}>Event not found. <Link to="/events" style={{ color: 'var(--accent)' }}>Browse Events</Link></div>;

  if (isSuccess) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ background: 'var(--white)', borderRadius: '24px', border: '1px solid var(--border)', padding: '48px', maxWidth: '480px', width: '100%', textAlign: 'center', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ width: '80px', height: '80px', background: 'var(--success-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <CheckCircle size={44} color="var(--success)" />
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: '800', marginBottom: '12px' }}>Booking Confirmed!</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '24px' }}>
          Your tickets for <strong>{event.title}</strong> are secured. A confirmation email has been sent.
        </p>
        <div style={{ background: 'var(--bg)', borderRadius: '12px', padding: '16px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--text-muted)', marginBottom: '4px', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: 'var(--font-display)' }}>Tickets</div>
            <div style={{ fontWeight: '700', fontFamily: 'var(--font-display)' }}>{count}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--text-muted)', marginBottom: '4px', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: 'var(--font-display)' }}>Total Paid</div>
            <div style={{ fontWeight: '700', fontFamily: 'var(--font-display)' }}>₹{(event.price * count).toLocaleString('en-IN')}</div>
          </div>
          {bookingId && <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--text-muted)', marginBottom: '4px', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: 'var(--font-display)' }}>Booking ID</div>
            <div style={{ fontWeight: '700', fontFamily: 'var(--font-display)', fontSize: '0.82rem' }}>#{bookingId.slice(-8).toUpperCase()}</div>
          </div>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={() => navigate('/my-bookings')} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px', borderRadius: '12px', fontSize: '0.95rem' }}>
            View My Bookings <ArrowRight size={17}/>
          </button>
          <Link to="/events" style={{ textAlign: 'center', color: 'var(--accent)', fontWeight: '500', fontSize: '0.9rem', padding: '10px' }}>Explore More Events</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Checkout Nav */}
      <nav style={{ height: 'var(--nav-height)', background: 'var(--white)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 5%' }}>
        <Link to={`/event/${id}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontWeight: '500', fontSize: '0.9rem' }}>
          <ArrowLeft size={17}/> Back
        </Link>
        <Link to="/" className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '1.3rem', color: 'var(--text-primary)' }}>
          <Ticket size={20} color="#5b47e0" fill="#5b47e0"/>Event<span style={{ color: '#5b47e0' }}>Pro</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <Shield size={14} color="var(--success)"/> Secure Checkout
        </div>
      </nav>

      {/* Progress indicator */}
      <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--border)', padding: '12px 5%' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <span style={{ color: 'var(--accent)', fontWeight: '600' }}>1 Select</span>
          <div style={{ width: '24px', height: '1px', background: 'var(--border)'}}/>
          <span style={{ color: 'var(--accent)', fontWeight: '600' }}>2 Review</span>
          <div style={{ width: '24px', height: '1px', background: 'var(--border)'}}/>
          <span>3 Confirm</span>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '36px 5%', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '28px', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Attendee */}
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><User size={18} color="#5b47e0"/>Attendee Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[['Name', user?.name || '—'], ['Email', user?.email || '—']].map(([k, v]) => (
                <div key={k} style={{ background: 'var(--bg)', borderRadius: '10px', padding: '12px 16px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: 'var(--font-display)', marginBottom: '4px' }}>{k}</div>
                  <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Ticket count */}
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Ticket size={18} color="#5b47e0"/>Select Quantity</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
              <button onClick={() => setCount(c => Math.max(1, c - 1))} disabled={count <= 1} style={{ width: '40px', height: '40px', borderRadius: '10px', border: '1.5px solid var(--border)', background: count <= 1 ? 'var(--bg)' : 'var(--white)', cursor: count <= 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)' }}>
                <Minus size={16}/>
              </button>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: '800', minWidth: '40px', textAlign: 'center' }}>{count}</span>
              <button onClick={() => setCount(c => Math.min(5, c + 1))} disabled={count >= 5 || count >= event.availableTickets} style={{ width: '40px', height: '40px', borderRadius: '10px', border: '1.5px solid var(--border)', background: count >= 5 ? 'var(--bg)' : 'var(--white)', cursor: count >= 5 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)' }}>
                <Plus size={16}/>
              </button>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Max 5 tickets per booking</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: event.availableTickets < 10 ? '#dc2626' : 'var(--text-muted)' }}>
              {event.availableTickets} ticket{event.availableTickets !== 1 ? 's' : ''} available
            </p>
          </div>

          {error && <div className="status-msg error">{error}</div>}
        </div>

        {/* Summary */}
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-md)', position: 'sticky', top: 'calc(var(--nav-height) + 20px)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '1rem', marginBottom: '20px' }}>Order Summary</h3>
          <img src={`${imgBase}${event.image}`} alt={event.title} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '10px', marginBottom: '16px' }} onError={e => e.target.src='https://via.placeholder.com/300x140?text=Event'}/>
          <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: '700', marginBottom: '12px', fontSize: '0.95rem', lineHeight: '1.3' }}>{event.title}</h4>
          <div style={{ display: 'flex', gap: '8px', flexDirection: 'column', marginBottom: '20px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={13} color="#9ca3af"/>{new Date(event.date).toLocaleDateString('en-GB')}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={13} color="#9ca3af"/>{event.location}</div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', marginBottom: '16px' }}>
            {[
              [`₹${event.price.toLocaleString('en-IN')} × ${count}`, `₹${(event.price * count).toLocaleString('en-IN')}`],
              ['Service Fee', '₹0'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '10px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{k}</span>
                <span style={{ fontWeight: '600' }}>{v}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '1.1rem', paddingTop: '10px', borderTop: '1px solid var(--border)', marginTop: '4px' }}>
              <span>Total</span>
              <span style={{ color: 'var(--accent)' }}>₹{(event.price * count).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button onClick={handleBooking} disabled={bookingLoading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px', borderRadius: '12px', fontSize: '0.95rem', fontFamily: 'var(--font-display)' }}>
            {bookingLoading ? 'Processing...' : 'Confirm Booking'}
          </button>
          <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <Shield size={12} color="var(--success)"/> Secure & encrypted transaction
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;