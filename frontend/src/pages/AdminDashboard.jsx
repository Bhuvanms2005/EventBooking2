import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
    Ticket, LayoutDashboard, Calendar, Users, 
    BarChart3, Bell, LogOut, ChevronRight, 
    Settings, Search, Filter, PlusCircle, ClipboardList
} from 'lucide-react';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/dashboard-stats`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setData(res.data);
                setLoading(false);
            } catch (err) {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/admin/login');
    };

    if (loading) return <div className="loading-screen">Syncing Dashboard Data...</div>;

    return (
        <div className="dashboard-layout">
            <nav className="top-nav">
                <div className="nav-content">
                    <div className="nav-logo-area">
                        <Ticket color="#ffbd2e" fill="#ffbd2e" size={28} />
                        <span className="nav-logo">EventPro Admin</span>
                    </div>
                </div>
                <div className="nav-links">
                    <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                        <LayoutDashboard size={18}/> Dashboard
                    </NavLink>
                    <NavLink to="/admin/manage-events" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                        <Calendar size={18}/> Events
                    </NavLink>
                    <NavLink to="/admin/users" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                        <Users size={18}/> Users
                    </NavLink>
                    <NavLink to="/admin/analytics" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                        <BarChart3 size={18}/> Analytics
                    </NavLink>
                    <NavLink to="/admin/bookings" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                        <ClipboardList size={18}/> Bookings
                    </NavLink>
                </div>
                <div className="nav-right">
                    <button className="logout-btn" onClick={handleLogout} title="Logout">
                        <LogOut size={18}/>
                    </button>
                </div>
            </nav>

            <div className="breadcrumb-bar">
                <Link to="/admin/dashboard" style={{textDecoration:'none', color:'inherit'}}>Admin Panel</Link> &nbsp; &gt; &nbsp; Dashboard
            </div>

            <header className="dashboard-hero">
                <div className="hero-text">
                    <h1>Welcome back, {data?.adminName || 'Admin'}!</h1>
                    <p>Here's a summary of your platform's performance today.</p>
                </div>
                <div className="hero-illustration">
                    <img src="https://illustrations.popsy.co/amber/digital-nomad.svg" alt="Admin Dashboard" />
                </div>
            </header>

            <main className="dashboard-grid">
                <aside className="sidebar-filters">
                    <div className="sidebar-card">
                        <div className="sidebar-header">
                            <Filter size={18} />
                            <h3>Quick Actions</h3>
                        </div>
                        
                        <div className="filter-section">
                            {/* Corrected CSS Class for Buttons */}
                            <Link to="/admin/manage-event/new" className="action-link-btn">
                                <PlusCircle size={16} /> Create New Event
                            </Link>
                            <Link to="/admin/users" className="action-link-btn secondary">
                                <Users size={16} /> Manage All Users
                            </Link>
                        </div>

                        <div className="filter-section">
                            <h4>View Filter</h4>
                            <select className="dash-select">
                                <option>Today's Overview</option>
                                <option>Last 7 Days</option>
                                <option>This Month</option>
                            </select>
                        </div>

                        <button className="apply-btn">Refresh Stats</button>
                    </div>

                    <div className="sidebar-card" style={{marginTop: '20px'}}>
                        <div className="sidebar-header">
                            <Settings size={18} />
                            <h3>System Logs</h3>
                        </div>
                        <ul className="tool-list">
                            <li>Server Status: <span style={{color:'#10b981'}}>Online</span></li>
                            <li>DB Connection: <span style={{color:'#10b981'}}>Stable</span></li>
                            <li>Last Backup: 2h ago</li>
                        </ul>
                    </div>
                </aside>

                <div className="main-content">
                    <div className="stats-container">
                        {data?.stats?.map(stat => (
                            <div key={stat.id} className="stat-card" onClick={() => stat.label === 'Platform Users' && navigate('/admin/users')} style={{cursor: 'pointer'}}>
                                <div className="stat-label">{stat.label}</div>
                                <div className="stat-value">{stat.value}</div>
                                <div className="stat-footer">
                                    <span className="growth-tag">{stat.growth}</span>
                                    <span className="stat-status">{stat.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bottom-panels">
                        <div className="panel-card">
                            <div className="panel-header">
                                <h3>Recent Transactions</h3>
                                <button className="text-link">View All Bookings</button>
                            </div>
                            <div className="data-list">
                                {data?.recentBookings?.length > 0 ? (
                                    data.recentBookings.map(booking => (
                                        <div key={booking.id} className="data-row">
                                            <img src={booking.img} alt="" className="avatar" />
                                            <div className="row-info">
                                                <h4>{booking.name}</h4>
                                                <p>{booking.user}</p>
                                            </div>
                                            <div className="row-meta">
                                                <span className={`status-badge status-${booking.status.toLowerCase()}`}>
                                                    {booking.status}
                                                </span>
                                                <span className="row-amount">{booking.amount}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="empty-state">
                                        <p>No recent bookings recorded today.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="panel-card">
                            <div className="panel-header">
                                <h3>System Notifications</h3>
                                <Bell size={20} color="#94a3b8" />
                            </div>
                            <div className="notification-list">
                                {data?.notifications?.length > 0 ? (
                                    data.notifications.map(note => (
                                        <div key={note.id} className="data-row">
                                            <div className="row-info">
                                                <h4>{note.user}</h4>
                                                <p>{note.message}</p>
                                                <span className="time-stamp">{note.time}</span>
                                            </div>
                                            <ChevronRight size={16} color="#cbd5e1" />
                                        </div>
                                    ))
                                ) : (
                                    <p className="empty-msg">No active notifications</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;