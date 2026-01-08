import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { Ticket, Edit, Trash2, Plus, Calendar, MapPin, ArrowLeft, LayoutDashboard, AlertCircle, X } from 'lucide-react';
import '../styles/ManageEvents.css';

const ManageEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
    const [showDeleteModal, setShowDeleteModal] = useState({ show: false, id: null });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/events/all`);
                setEvents(res.data);
                setLoading(false);
            } catch (err) {
                setLoading(false);
                setStatusMsg({ type: 'error', text: 'Failed to sync with database.' });
            }
        };
        fetchEvents();
    }, []);

    const confirmDelete = async () => {
        const id = showDeleteModal.id;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/events/${id}`);
            setEvents(events.filter(event => event._id !== id));
            setStatusMsg({ type: 'success', text: 'Event successfully removed.' });
            setShowDeleteModal({ show: false, id: null });
            setTimeout(() => setStatusMsg({ type: '', text: '' }), 3000);
        } catch (err) {
            setStatusMsg({ type: 'error', text: 'Error: Could not delete event.' });
            setShowDeleteModal({ show: false, id: null });
        }
    };

    if (loading) return <div className="loading-screen">Verifying Event Records...</div>;

    return (
        <div className="manage-events-container">
            <nav className="top-nav">
                <div className="nav-content">
                    <div className="nav-logo-area">
                        <Ticket color="#ffbd2e" fill="#ffbd2e" size={28} />
                        <span className="nav-logo">EventPro Admin</span>
                    </div>
                    
                    {/* Added Dashboard Navigation Item */}
                    <div className="nav-links">
                        <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                            <LayoutDashboard size={18}/> Dashboard
                        </NavLink>
                        <NavLink to="/admin/manage-events" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                            <Calendar size={18}/> Events
                        </NavLink>
                    </div>
                </div>
            </nav>

            <div className="breadcrumb-bar">
                <Link to="/admin/dashboard" style={{textDecoration:'none', color:'inherit'}}>Admin Panel</Link> &nbsp; &gt; &nbsp; Events
            </div>

            <header className="dashboard-hero">
                <div className="hero-text">
                    <div style={{display:'flex', alignItems:'center', gap:'15px', marginBottom:'10px'}}>
                        <button onClick={() => navigate('/admin/dashboard')} className="btn-back-circle">
                            <ArrowLeft size={20} />
                        </button>
                        <h1>Manage Events</h1>
                    </div>
                    <p>Centralized control for all published event listings.</p>
                </div>
                <div className="hero-actions">
                    <Link to="/admin/manage-event/new" className="apply-btn" style={{textDecoration:'none', display:'flex', alignItems:'center', gap:'10px'}}>
                        <Plus size={20} /> Create New Event
                    </Link>
                </div>
            </header>

            <main className="events-list-container">
                {statusMsg.text && (
                    <div className={`status-banner ${statusMsg.type === 'error' ? 'status-error' : 'status-success'}`}>
                        {statusMsg.type === 'error' ? <AlertCircle size={18} /> : null}
                        {statusMsg.text}
                    </div>
                )}

                <div className="events-table-card">
                    <table className="events-table">
                        <thead>
                            <tr>
                                <th>Event Info</th>
                                <th>Category</th>
                                <th>Date & Location</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map(event => (
                                <tr key={event._id}>
                                    <td>
                                        <div className="event-info-cell">
                                            <img
  src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${event.image}`}
  alt={event.title}
  className="event-thumb"
/>

                                            <div>
                                                <div className="event-name">{event.title}</div>
                                                <div className="event-id">ID: {event._id.slice(-6)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className="cat-badge">{event.category}</span></td>
                                    <td>
                                        <div className="date-loc">
                                            <div><Calendar size={14} /> {new Date(event.date).toLocaleDateString('en-GB')}</div>
                                            <div><MapPin size={14} /> {event.location}</div>
                                        </div>
                                    </td>
                                    <td><strong>₹{Math.round(event.price)}</strong></td>
                                    <td><span className={`status-badge status-${event.status.toLowerCase()}`}>{event.status}</span></td>
                                    <td>
                                        <div className="action-btns">
                                            <Link to={`/admin/manage-event/${event._id}`} className="edit-btn"><Edit size={18} /></Link>
                                            <button className="del-btn" onClick={() => setShowDeleteModal({ show: true, id: event._id })}><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            {showDeleteModal.show && (
                <div className="modal-overlay">
                    <div className="confirmation-modal">
                        <div className="modal-header">
                            <div className="alert-icon-box"><AlertCircle color="#ef4444" size={32} /></div>
                            <h2>Confirm Deletion</h2>
                        </div>
                        <p>This action cannot be undone. Are you sure you want to permanently remove this event from the database?</p>
                        <div className="modal-footer">
                            <button className="cancel-btn" onClick={() => setShowDeleteModal({ show: false, id: null })}>Cancel</button>
                            <button className="confirm-btn" onClick={confirmDelete}>Delete Event</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageEvents;