import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Ticket, Calendar, MapPin, Clock, ArrowLeft, Download, ExternalLink, ChevronRight } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import '../styles/MyBookings.css';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const ticketRef = useRef();

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

const downloadTicket = async (booking) => {
    const element = document.getElementById(`printable-ticket-${booking._id}`);
    
    // 1. Force display and give it a height/width so it's not "empty"
    element.style.display = "block";
    element.style.position = "fixed"; // Move it off-screen so user doesn't see it flicker
    element.style.left = "-9999px"; 

    // 2. Wait for everything to settle
    setTimeout(async () => {
        try {
            const canvas = await html2canvas(element, { 
                scale: 2, 
                useCORS: true, 
                allowTaint: false,
                backgroundColor: "#ffffff",
                logging: false
            });

            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            // Adjust dimensions to fit nicely
            pdf.addImage(imgData, 'JPEG', 10, 10, 190, 90);
            pdf.save(`Ticket-${booking._id.slice(-6)}.pdf`);
        } catch (err) {
            console.error("PDF Error:", err);
        } finally {
            // 3. Reset styles
            element.style.display = "none";
            element.style.position = "static";
        }
    }, 500); // Increased delay to 500ms to ensure QR/Images are ready
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
    
    {/* --- HIDDEN PRINTABLE SECTION --- */}
    <div 
        id={`printable-ticket-${booking._id}`} 
        className="offscreen-print-template"
        style={{
            width: '600px', 
            padding: '40px', 
            background: 'white', 
            color: 'black', // Force black text
            border: '2px solid #333',
            display: 'none', // Controlled by your downloadTicket function
            fontFamily: 'Arial, sans-serif'
        }}
    >
        <h2 style={{ borderBottom: '2px solid #ffbd2e', paddingBottom: '10px', color: '#1e3a8a' }}>
            {booking.event?.title}
        </h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <div style={{ lineHeight: '1.8' }}>
                <p><strong>Customer:</strong> {booking.user?.name || 'Guest'}</p>
                <p><strong>Date:</strong> {new Date(booking.event?.date).toLocaleDateString('en-GB')}</p>
                <p><strong>Location:</strong> {booking.event?.location}</p>
                <p><strong>Seats:</strong> {booking.ticketCount} Tickets</p>
                <p style={{ fontSize: '12px', marginTop: '10px', color: '#666' }}>
                    ID: {booking._id}
                </p>
            </div>
            <div style={{ textAlign: 'center' }}>
                <QRCodeCanvas value={booking._id} size={120} includeMargin={true} />
                <p style={{ fontSize: '10px', marginTop: '5px' }}>Scan to Verify</p>
            </div>
        </div>
        <div style={{ marginTop: '30px', borderTop: '1px dashed #ccc', paddingTop: '10px', textAlign: 'center', fontSize: '12px' }}>
            Thank you for booking with EventPro!
        </div>
    </div>

                                <div className="ticket-img">
                                    <img src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${booking.event?.image}`} alt={booking.event?.title} className="event-thumb" />
                                    <div className={`status-badge ${booking.status.toLowerCase()}`}>{booking.status}</div>
                                </div>
                                <div className="ticket-info">
                                    <span className="category-label">{booking.event?.category}</span>
                                    <h3>{booking.event?.title}</h3>
                                    <div className="info-row"><Calendar size={16} /><span>{new Date(booking.event?.date).toLocaleDateString('en-GB')}</span></div>
                                    <div className="info-row"><MapPin size={16} /><span>{booking.event?.location}</span></div>
                                    <div className="ticket-footer">
                                        <div className="seats-count"><strong>{booking.ticketCount}</strong> Seats</div>
                                        <div className="price-paid">Paid: <strong>₹{booking.totalPrice}</strong></div>
                                    </div>
                                    <div className="ticket-actions">
                                        <button className="action-btn download" onClick={() => downloadTicket(booking)}>
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