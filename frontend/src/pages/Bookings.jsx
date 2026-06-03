import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, NavLink } from 'react-router-dom';
import { 
    Ticket, LayoutDashboard, Calendar, Users, 
    BarChart3, Search, CheckCircle, XCircle, 
    ArrowLeft, Mail, ClipboardList, ShieldCheck
} from 'lucide-react';
import '../styles/ManageEvents.css';

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/bookings`);
            setBookings(res.data);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            setStatusMsg({ type: 'error', text: 'Failed to synchronize bookings table.' });
        }
    };

    const handleCheckIn = async (id) => {
        try {
            const res = await axios.put(`${import.meta.env.VITE_API_URL}/admin/bookings/${id}/checkin`);
            setBookings(bookings.map(b => b._id === id ? { ...b, checkInStatus: res.data.checkInStatus } : b));
            setStatusMsg({ type: 'success', text: `Guest status updated successfully.` });
            setTimeout(() => setStatusMsg({ type: '', text: '' }), 3000);
        } catch (err) {
            setStatusMsg({ type: 'error', text: 'Update failed. Check system logs.' });
        }
    };

    const filteredBookings = bookings.filter(b => 
        b.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        b.event?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="loading-screen">Retrieving Transaction Records...</div>;

    return (
        <div className="manage-events-container">
            <nav className="top-nav">
                <div className="nav-content">
                    <div className="nav-logo-area">
                        <Ticket color="#ffbd2e" fill="#ffbd2e" size={28} />
                        <span className="nav-logo">EventPro Admin</span>
                    </div>
                    <div className="nav-links">
                        <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}><LayoutDashboard size={18}/> Dashboard</NavLink>
                        <NavLink to="/admin/manage-events" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}><Calendar size={18}/> Events</NavLink>
                        <NavLink to="/admin/users" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}><Users size={18}/> Users</NavLink>
                        <NavLink to="/admin/bookings" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}><ClipboardList size={18}/> Bookings</NavLink>
                    </div>
                </div>
            </nav>

            <div className="breadcrumb-bar">
                <Link to="/admin/dashboard" style={{textDecoration:'none', color:'inherit'}}>Admin Panel</Link> &nbsp; &gt; &nbsp; Bookings
            </div>

            <header className="dashboard-hero">
                <div className="hero-text">
                    <div style={{display:'flex', alignItems:'center', gap:'15px', marginBottom:'10px'}}>
                        <Link to="/admin/dashboard" className="btn-back-circle"><ArrowLeft size={20} /></Link>
                        <h1>Tickets & Bookings</h1>
                    </div>
                    <p>Oversee ticket inventory, verify guest check-ins, and manage transactions.</p>
                </div>
                <div className="search-box" style={{background: 'white', padding: '10px 20px', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '10px', width: '300px'}}>
                    <Search size={18} color="#94a3b8" />
                    <input 
                        type="text" 
                        placeholder="Search Guest or Event..." 
                        style={{border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem'}}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            <main className="events-list-container">
                {statusMsg.text && (
                    <div className={`status-banner ${statusMsg.type === 'error' ? 'status-error' : 'status-success'}`}>
                        {statusMsg.text}
                    </div>
                )}

                <div className="events-table-card">
                    <table className="events-table">
                        <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>Event Details</th>
                                <th>Customer</th>
                                <th>Tickets</th>
                                <th>Total Paid</th>
                                <th>Entry Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.map(booking => (
                                <tr key={booking._id}>
                                    <td style={{fontWeight:'700', color:'#6366f1'}}>#{booking._id.slice(-6).toUpperCase()}</td>
                                    <td>
                                        <div className="event-name">{booking.event?.title}</div>
                                        <div className="event-id">₹{booking.event?.price} per seat</div>
                                    </td>
                                    <td>
                                        <div className="event-name">{booking.user?.name}</div>
                                        <div className="event-id"><Mail size={12}/> {booking.user?.email}</div>
                                    </td>
                                    <td><strong>{booking.ticketCount}</strong></td>
                                    <td><strong style={{color:'#10b981'}}>₹{booking.totalAmount}</strong></td>
                                    <td>
                                        <button 
                                            onClick={() => handleCheckIn(booking._id)}
                                            className={`status-badge ${booking.checkInStatus ? 'status-active' : 'status-suspended'}`}
                                            style={{border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:'5px'}}
                                        >
                                            {booking.checkInStatus ? <ShieldCheck size={14}/> : <XCircle size={14}/>}
                                            {booking.checkInStatus ? 'Checked In' : 'Pending'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default Bookings;