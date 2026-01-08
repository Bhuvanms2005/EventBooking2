import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Ticket, Save, ArrowLeft, Upload, Clock, MapPin } from 'lucide-react';
import '../styles/ManageEventPage.css';

const ManageEventPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isNew = id === 'new';
    
    const [event, setEvent] = useState({
        title: '', description: '', date: '', startTime: '', endTime: '',
        location: '', category: 'Concerts', price: '', capacity: '', status: 'Upcoming'
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

    useEffect(() => {
        if (!isNew) {
            axios.get(`${import.meta.env.VITE_API_URL}/events/${id}`)
                .then(res => {
                    const data = res.data.event;
                    setEvent({
                        ...data,
                        date: data.date ? data.date.split('T')[0] : ''
                    });
                    setPreview(data.image);
                })
                .catch(() => setStatusMsg({ type: 'error', text: 'Failed to load event' }));
        }
    }, [id, isNew]);

    const formatDisplayDate = (dateStr) => {
        if (!dateStr) return 'dd/mm/yyyy';
        const [y, m, d] = dateStr.split('-');
        return `${d}/${m}/${y}`;
    };

    const handleAction = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        
        Object.keys(event).forEach(key => {
            if (key === 'price') {
                formData.append(key, Math.round(Number(event[key])));
            } else {
                formData.append(key, event[key] || '');
            }
        });

        formData.append('availableTickets', event.capacity || 0);
        if (selectedFile) formData.append('image', selectedFile);

        try {
            if (isNew) {
                await axios.post(`${import.meta.env.VITE_API_URL}/events/create`, formData);
                setStatusMsg({ type: 'success', text: 'Event Published!' });
            } else {
                await axios.put(`${import.meta.env.VITE_API_URL}/events/${id}`, formData);
                setStatusMsg({ type: 'success', text: 'Event Updated!' });
            }
            setTimeout(() => navigate('/admin/manage-events'), 1500);
        } catch (err) {
            setStatusMsg({ type: 'error', text: 'Error: Check server logs.' });
        }
    };

    return (
        <div className="manage-event-container">
            <header className="dashboard-hero">
                <div className="hero-text">
                    <h1>{isNew ? 'New Event Details' : 'Edit Event'}</h1>
                </div>
            </header>

            <main className="manage-grid">
                <aside className="sidebar-card">
                    <label>Event Status</label>
                    <select value={event.status || 'Upcoming'} onChange={(e) => setEvent({...event, status: e.target.value})}>
                        <option value="Upcoming">Upcoming</option>
                        <option value="Past">Past</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                    <button onClick={() => navigate('/admin/manage-events')} className="btn-delete" style={{marginTop:'20px', width:'100%'}}>
                        <ArrowLeft size={16}/> Back to List
                    </button>
                </aside>

                <section className="event-card-form">
                    {statusMsg.text && (
                        <div className={`status-message ${statusMsg.type === 'error' ? 'status-error' : 'status-success'}`}>
                            {statusMsg.text}
                        </div>
                    )}
                    
                    <form onSubmit={handleAction}>
                        <div className="form-row">
                            <div className="input-group">
                                <label>Event Title</label>
                                <input type="text" required value={event.title || ''} onChange={(e) => setEvent({...event, title: e.target.value})} />
                            </div>
                            <div className="input-group">
                                <label>Category</label>
                                <select value={event.category || 'Concerts'} onChange={(e) => setEvent({...event, category: e.target.value})}>
                                    <option value="Concerts">Concerts</option>
                                    <option value="Festivals">Festivals</option>
                                    <option value="Tech">Tech</option>
                                    <option value="Workshops">Workshops</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Conference">Conference</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="input-group">
                                <label>Location</label>
                                <input type="text" required value={event.location || ''} onChange={(e) => setEvent({...event, location: e.target.value})} />
                            </div>
                            <div className="input-group">
                                <label>Date</label>
                                <input type="date" required value={event.date || ''} onChange={(e) => setEvent({...event, date: e.target.value})} />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="input-group">
                                <label>Start Time</label>
                                <input type="time" required value={event.startTime || ''} onChange={(e) => setEvent({...event, startTime: e.target.value})} />
                            </div>
                            <div className="input-group">
                                <label>End Time</label>
                                <input type="time" required value={event.endTime || ''} onChange={(e) => setEvent({...event, endTime: e.target.value})} />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="input-group">
                                <label>Total Capacity</label>
                                <input type="number" required value={event.capacity || ''} onChange={(e) => setEvent({...event, capacity: e.target.value})} />
                            </div>
                            <div className="input-group currency-input">
                                <label>Ticket Price (INR)</label>
                                <input type="number" step="1" required value={event.price || ''} onChange={(e) => setEvent({...event, price: e.target.value})} />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Event Image</label>
                            <div className="file-input-wrapper" onClick={() => document.getElementById('fileInput').click()}>
                                <Upload size={24} />
                                <p>{selectedFile ? selectedFile.name : "Choose file"}</p>
                                <input id="fileInput" type="file" hidden onChange={(e) => {
                                    setSelectedFile(e.target.files[0]);
                                    setPreview(URL.createObjectURL(e.target.files[0]));
                                }} />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Description</label>
                            <textarea rows="4" required value={event.description || ''} onChange={(e) => setEvent({...event, description: e.target.value})}></textarea>
                        </div>

                        <button type="submit" className="btn-save" style={{marginTop:'30px', width: '100%'}}>
                            <Save size={18} /> {isNew ? 'PUBLISH EVENT' : 'UPDATE EVENT'}
                        </button>
                    </form>
                </section>

                <aside className="ticket-summary-panel">
                    <div className="summary-card">
                        <div className="preview-box">
                            {preview ? <img src={preview} alt="" /> : "IMAGE PREVIEW"}
                        </div>
                        <div className="summary-content">
                            <h4>{event.title || 'Event Name'}</h4>
                            <p style={{color: '#64748b'}}><Clock size={14}/> {event.startTime || '--:--'} - {event.endTime || '--:--'}</p>
                            <p style={{fontSize: '0.85rem', color: '#94a3b8'}}>{formatDisplayDate(event.date)}</p>
                            <h3 style={{marginTop:'10px', color: '#1e3a8a'}}>₹ {event.price ? Math.round(event.price) : '0'}</h3>
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
};

export default ManageEventPage;