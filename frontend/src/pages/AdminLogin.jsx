import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Ticket, Shield, Mail, Lock, Calendar, Headset } from 'lucide-react';
import '../styles/AdminLogin.css';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });
        
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/admin/login`, { email, password });
            localStorage.setItem('token', res.data.token);
            setStatus({ type: 'success', message: 'Login successful! Redirecting...' });
            setTimeout(() => {
                navigate('/admin/dashboard');
            }, 1500);
        } catch (err) {
            setStatus({ 
                type: 'error', 
                message: err.response?.data?.message || 'Invalid email or password. Please try again.' 
            });
        }
    };

    return (
        <div className="admin-login-page">
            <nav className="navbar">
                <div className="nav-content">
                    <Ticket size={28} color="#ffbd2e" fill="#ffbd2e" />
                    <span className="nav-logo">Event Ticket Booking</span>
                </div>
            </nav>

            <div className="breadcrumb-bar">
                Admin Panel &nbsp; &gt; &nbsp; Login
            </div>

            <section className="hero-section">
                <div className="hero-content">
                    <div className="shield-container">
                        <Shield size={64} color="#ffbd2e" fill="#ffbd2e" fillOpacity={0.2} />
                    </div>
                    <h1>Admin Login</h1>
                    <p>Welcome back! Please log in to manage events.</p>
                </div>
            </section>

            <main className="main-container">
                <aside className="sidebar">
                    <h3>Filter Bookings</h3>
                    <div className="filter-group">
                        <h4>Booking Status</h4>
                        <label className="filter-option"><input type="radio" name="status" defaultChecked /> All</label>
                        <label className="filter-option"><input type="radio" name="status" /> Upcoming</label>
                        <label className="filter-option"><input type="radio" name="status" /> Past</label>
                    </div>

                    <div className="filter-group">
                        <h4>Category</h4>
                        {['All', 'Concerts', 'Conferences', 'Festivals','Workshops','Sports','Conference'].map(cat => (
                            <label key={cat} className="filter-option">
                                <input type="checkbox" defaultChecked={cat === 'All'} /> {cat}
                            </label>
                        ))}
                    </div>

                    <div className="filter-group">
                        <h4>Date Filter</h4>
                        <input type="date" className="date-picker" />
                        <input type="date" className="date-picker" />
                    </div>

                    <button className="apply-btn">APPLY FILTER</button>
                </aside>

                <section className="login-card">
                    <div className="form-side">
                        <h2>Admin Login</h2>
                        <p>Enter your details to access the dashboard</p>

                        {status.message && (
                            <div className={`status-message ${status.type === 'error' ? 'status-error' : 'status-success'}`}>
                                {status.message}
                            </div>
                        )}

                        <form onSubmit={handleLogin}>
                            <div className="input-wrapper">
                                <Mail className="input-icon" size={20} />
                                <input 
                                    type="email" 
                                    placeholder="bhuvc" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required 
                                />
                            </div>
                            <div className="input-wrapper">
                                <Lock className="input-icon" size={20} />
                                <input 
                                    type="password" 
                                    placeholder="••••••••" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required 
                                />
                            </div>
                            <a href="#" className="forgot-link">Forgot Password?</a>
                            <button type="submit" className="login-btn">LOGIN NOW</button>
                        </form>
                    </div>

                    <div className="illustration-side">
                        <img src="https://illustrations.popsy.co/amber/customer-support.svg" alt="Admin character" />
                    </div>
                </section>
            </main>

            <section className="features-grid">
                <div className="feature-card"><Shield size={24} color="#6366f1" /> Admin Access Only</div>
                <div className="feature-card"><Calendar size={24} color="#6366f1" /> Create & Manage Events</div>
                <div className="feature-card"><Headset size={24} color="#6366f1" /> 24/7 Support Active</div>
            </section>

            <footer className="footer">
                Need help? Contact us at support@eventticketbooking.com
            </footer>
        </div>
    );
};

export default AdminLogin;