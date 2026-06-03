import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { Ticket, Calendar, MapPin, Download, ExternalLink, Menu, X, AlertCircle } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import '../App.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    
    axios.get(`${import.meta.env.VITE_API_URL}/bookings/my`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => { setBookings(res.data); setLoading(false); })
      .catch(err => {
        setLoading(false);
        if (err.response?.status === 401) navigate('/login');
      });
  }, []);

  const downloadTicket = async (booking) => {
    setDownloadingId(booking._id);
    const el = document.getElementById(`ticket-print-${booking._id}`);
    el.style.cssText = 'display:block;position:fixed;left:-9999px;top:0;';
    await new Promise(r => setTimeout(r, 600));
    try {
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(canvas.toDataURL('image/jpeg', 1.0), 'JPEG', 15, 15, 180, 85);
      pdf.save(`EventPro-Ticket-${booking._id.slice(-8).toUpperCase()}.pdf`);
    } catch (e) { console.error(e); } 
    finally {
      el.style.cssText = 'display:none;';
      setDownloadingId(null);
    }
  };

  const imgBase = import.meta.env.VITE_API_URL.replace('/api', '');

  if (loading) return <div className="loading-screen">Fetching your tickets...</div>;

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
            <button className="btn-outline" onClick={() => { localStorage.clear(); navigate('/login'); }}>Sign Out</button>
            <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X size={22}/> : <Menu size={22}/>}</button>
          </div>
        </div>
      </nav>
      <div className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
        <NavLink to="/" end onClick={() => setIsMenuOpen(false)}>Home</NavLink>
        <NavLink to="/events" onClick={() => setIsMenuOpen(false)}>Events</NavLink>
        <NavLink to="/my-bookings" onClick={() => setIsMenuOpen(false)}>My Bookings</NavLink>
      </div>

      <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--border)', padding: '32px 5%' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: '800', marginBottom: '6px' }}>My Bookings</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{bookings.length} booking{bookings.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '36px 5%' }}>
        {bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--white)', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <Ticket size={48} color="#e5e7eb" style={{ margin: '0 auto 16px' }}/>
            <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '1.2rem' }}>No bookings yet</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>Discover and book your first event experience</p>
            <Link to="/events" className="btn-primary">Explore Events</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {bookings.map(booking => (
              <div key={booking._id}>
                {/* Hidden printable ticket */}
                <div id={`ticket-print-${booking._id}`} style={{ display: 'none', width: '680px', padding: '32px 40px', background: 'white', fontFamily: 'Arial, sans-serif', borderRadius: '12px', border: '2px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '2px solid #5b47e0', paddingBottom: '16px', marginBottom: '20px' }}>
                    <div style={{ fontSize: '22px', fontWeight: '800', color: '#111827' }}>EventPro</div>
                    <div style={{ height: '20px', width: '1px', background: '#e5e7eb' }}/>
                    <div style={{ fontSize: '14px', color: '#5b47e0', fontWeight: '600' }}>E-TICKET</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ lineHeight: '1.9' }}>
                      <div style={{ fontSize: '18px', fontWeight: '800', color: '#111827', marginBottom: '8px' }}>{booking.event?.title}</div>
                      <div style={{ fontSize: '13px', color: '#4b5563' }}>📅 {new Date(booking.event?.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
                      <div style={{ fontSize: '13px', color: '#4b5563' }}>📍 {booking.event?.location}</div>
                      <div style={{ fontSize: '13px', color: '#4b5563' }}>👤 {booking.user?.name || 'Guest'}</div>
                      <div style={{ fontSize: '13px', color: '#4b5563' }}>🎫 {booking.ticketCount} Ticket{booking.ticketCount > 1 ? 's' : ''}</div>
                      <div style={{ fontSize: '13px', color: '#4b5563' }}>💰 ₹{booking.totalPrice?.toLocaleString('en-IN')}</div>
                      <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '8px' }}>Booking ID: {booking._id}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <QRCodeCanvas value={booking._id} size={110} includeMargin={true}/>
                      <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '4px' }}>Scan to verify</div>
                    </div>
                  </div>
                  <div style={{ borderTop: '1px dashed #e5e7eb', marginTop: '20px', paddingTop: '12px', textAlign: 'center', fontSize: '11px', color: '#9ca3af' }}>
                    Thank you for booking with EventPro! Have a great experience.
                  </div>
                </div>

                {/* Booking Card */}
                <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden', display: 'grid', gridTemplateColumns: '200px 1fr', transition: 'box-shadow 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
                  <div style={{ position: 'relative' }}>
                    <img src={`${imgBase}${booking.event?.image}`} alt={booking.event?.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', minHeight: '160px' }} onError={e => e.target.src='https://via.placeholder.com/200x160?text=Event'}/>
                    <div style={{ position: 'absolute', top: '12px', right: '12px', background: booking.status === 'Confirmed' ? 'var(--success)' : '#dc2626', color: 'white', fontSize: '0.72rem', fontWeight: '700', padding: '3px 10px', borderRadius: '9999px', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{booking.status}</div>
                  </div>
                  <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ background: 'var(--accent-soft)', color: 'var(--accent)', fontSize: '0.75rem', fontWeight: '600', padding: '3px 10px', borderRadius: '9999px', fontFamily: 'var(--font-display)', display: 'inline-block', marginBottom: '8px' }}>{booking.event?.category}</span>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '1.1rem', marginBottom: '12px', lineHeight: '1.3' }}>{booking.event?.title}</h3>
                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={13} color="#9ca3af"/>{new Date(booking.event?.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin size={13} color="#9ca3af"/>{booking.event?.location}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', marginTop: '12px', flexWrap: 'wrap', gap: '12px' }}>
                      <div style={{ display: 'flex', gap: '20px' }}>
                        <div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}>Seats</div>
                          <div style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '1.1rem' }}>{booking.ticketCount}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}>Paid</div>
                          <div style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '1.1rem' }}>₹{booking.totalPrice?.toLocaleString('en-IN')}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => downloadTicket(booking)} disabled={downloadingId === booking._id} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', border: '1.5px solid var(--border)', borderRadius: '10px', background: 'var(--white)', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600', fontFamily: 'var(--font-body)', transition: 'all 0.2s' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = '#5b47e0'; e.currentTarget.style.color = '#5b47e0'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-primary)'; }}>
                          <Download size={15}/>{downloadingId === booking._id ? 'Generating...' : 'Download'}
                        </button>
                        <Link to={`/event/${booking.event?._id}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '10px', background: 'var(--accent-soft)', color: 'var(--accent)', fontSize: '0.85rem', fontWeight: '600', fontFamily: 'var(--font-body)' }}>
                          <ExternalLink size={15}/> View Event
                        </Link>
                      </div>
                    </div>
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