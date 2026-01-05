import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Ticket, MapPin, User, ShieldCheck, ArrowLeft, Plus, Minus, CheckCircle, ArrowRight } from 'lucide-react';
import '../styles/CheckoutPage.css';

const CheckoutPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [user] = useState(JSON.parse(localStorage.getItem('user')));
    const [count, setCount] = useState(1);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false); // New state for success screen

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/events/public/${id}`);
                setEvent(res.data.event);
                setLoading(false);
            } catch (err) { setLoading(false); }
        };
        fetchEvent();
    }, [id]);

    const handleBooking = async () => {
        setBookingLoading(true);
        try {
            const token = localStorage.getItem('token');
            const bookingData = {
                eventId: event._id,
                ticketCount: count,
                totalPrice: event.price * count
            };

            await axios.post(
                `${import.meta.env.VITE_API_URL}/bookings/create`, 
                bookingData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setIsSuccess(true); // Show success screen instead of alert
        } catch (err) {
            alert(err.response?.data?.message || "Booking failed");
        } finally { setBookingLoading(false); }
    };

    if (loading) return <div className="loading">Loading...</div>;

    // --- SUCCESS SCREEN RENDER ---
    if (isSuccess) {
        return (
            <div className="success-screen-container">
                <div className="success-card">
                    <div className="success-icon-wrapper">
                        <CheckCircle size={80} color="#10b981" />
                    </div>
                    <h2>Booking Confirmed!</h2>
                    <p>Pack your bags! Your tickets for <strong>{event.title}</strong> have been secured.</p>
                    
                    <div className="booking-details-mini">
                        <span>Transaction ID: #EPRO{Math.floor(1000 + Math.random() * 9000)}</span>
                        <span>Tickets: {count} Seats</span>
                    </div>

                    <div className="success-actions">
                        <button onClick={() => navigate('/my-bookings')} className="view-bookings-btn">
                            View My Bookings <ArrowRight size={18} />
                        </button>
                        <Link to="/events" className="go-home-link">Explore More Events</Link>
                    </div>
                </div>
            </div>
        );
    }

    // --- NORMAL CHECKOUT RENDER ---
    return (
        <div className="checkout-container">
            <div className="checkout-nav">
                <Link to={`/event/${id}`} className="back-link"><ArrowLeft size={20}/> Back</Link>
                <h3>Checkout</h3>
            </div>
            <main className="checkout-layout">
                <div className="checkout-left">
                    <div className="checkout-card">
                        <h4>Attendee Details</h4>
                        <div className="user-info-row">
                             <User size={20} color="#6366f1"/>
                             <div>
                                <p><strong>Name:</strong> {user?.name}</p>
                                <p><strong>Email:</strong> {user?.email}</p>
                             </div>
                        </div>
                    </div>
                    <div className="checkout-card">
                        <h4>Select Quantity</h4>
                        <div className="qty-picker">
                            <button onClick={() => count > 1 && setCount(count - 1)}><Minus/></button>
                            <span>{count}</span>
                            <button onClick={() => count < 5 && setCount(count + 1)}><Plus/></button>
                        </div>
                        <p className="qty-hint">You can book up to 5 tickets per transaction.</p>
                    </div>
                </div>
                <aside className="checkout-right">
                    <div className="summary-card">
                        <h4>Order Summary</h4>
                        <p className="summary-event-title">{event.title}</p>
                        <div className="price-row">
                            <span>₹{event.price} x {count}</span>
                            <span>₹{event.price * count}</span>
                        </div>
                        <button className="confirm-btn" onClick={handleBooking} disabled={bookingLoading}>
                            {bookingLoading ? "Processing..." : "Confirm Booking"}
                        </button>
                        <p className="secure-text"><ShieldCheck size={14}/> Secure Transaction</p>
                    </div>
                </aside>
            </main>
        </div>
    );
};

export default CheckoutPage;