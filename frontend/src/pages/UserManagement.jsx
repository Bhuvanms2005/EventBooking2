import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, NavLink } from 'react-router-dom';
import { 
    Ticket, Users, UserX, UserCheck, LayoutDashboard, 
    Calendar, Mail, ShieldAlert, ArrowLeft, Search, AlertCircle 
} from 'lucide-react';
import '../styles/UserManagement.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/users`);
            // Ensure we always have an array even if the server returns something else
            setUsers(Array.isArray(res.data) ? res.data : []);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            setStatusMsg({ type: 'error', text: 'Critical Error: Unable to reach user database.' });
        }
    };

    const handleStatusToggle = async (id, currentStatus) => {
        const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/admin/users/${id}/status`, { status: newStatus });
            setUsers(users.map(u => u._id === id ? { ...u, status: newStatus } : u));
            setStatusMsg({ type: 'success', text: `Account successfully ${newStatus.toLowerCase()}.` });
            setTimeout(() => setStatusMsg({ type: '', text: '' }), 4000);
        } catch (err) {
            setStatusMsg({ type: 'error', text: 'Command failed: Permissions restricted.' });
        }
    };

    const handleRoleChange = async (id, newRole) => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/admin/users/${id}/role`, { role: newRole });
            setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
            setStatusMsg({ type: 'success', text: 'User permissions updated.' });
            setTimeout(() => setStatusMsg({ type: '', text: '' }), 4000);
        } catch (err) {
            setStatusMsg({ type: 'error', text: 'Error updating user role.' });
        }
    };

    // FIXED: Safe filtering logic
    const filteredUsers = users.filter(user => {
        const name = user.name ? user.name.toLowerCase() : '';
        const email = user.email ? user.email.toLowerCase() : '';
        const query = searchTerm.toLowerCase();
        return name.includes(query) || email.includes(query);
    });

    if (loading) return <div className="loading-screen">Authenticating Directory Access...</div>;

    return (
        <div className="manage-events-container">
            <nav className="top-nav">
                <div className="nav-content">
                    <div className="nav-logo-area">
                        <Ticket color="#ffbd2e" fill="#ffbd2e" size={28} />
                        <span className="nav-logo">EventPro Admin</span>
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
                    </div>
                </div>
            </nav>

            <div className="breadcrumb-bar">
                <Link to="/admin/dashboard" style={{textDecoration:'none', color:'inherit'}}>Admin Panel</Link> &nbsp; &gt; &nbsp; Users
            </div>

            <header className="dashboard-hero">
                <div className="hero-text">
                    <div style={{display:'flex', alignItems:'center', gap:'15px', marginBottom:'10px'}}>
                        <Link to="/admin/dashboard" className="btn-back-circle">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1>User Governance</h1>
                    </div>
                    <p>Monitor registration, modify access levels, and handle suspensions.</p>
                </div>
                <div className="search-box" style={{background: 'white', padding: '10px 20px', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '10px', width: '300px'}}>
                    <Search size={18} color="#94a3b8" />
                    <input 
                        type="text" 
                        placeholder="Search name or email..." 
                        style={{border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem'}}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            <main className="events-list-container">
                {statusMsg.text && (
                    <div className={`status-banner ${statusMsg.type === 'error' ? 'status-error' : 'status-success'}`}>
                        {statusMsg.type === 'error' && <ShieldAlert size={18} />}
                        {statusMsg.text}
                    </div>
                )}

                <div className="events-table-card">
                    <table className="events-table">
                        <thead>
                            <tr>
                                <th>Identity</th>
                                <th>Access Level</th>
                                <th>Registration Date</th>
                                <th>Tickets</th>
                                <th>Status</th>
                                <th>Control</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map(user => (
                                    <tr key={user._id}>
                                        <td>
                                            <div className="event-info-cell">
                                                <div className="avatar-circle">{user.name ? user.name.charAt(0) : '?'}</div>
                                                <div>
                                                    <div className="event-name">{user.name || 'Unknown User'}</div>
                                                    <div className="event-id"><Mail size={12} style={{verticalAlign:'middle'}}/> {user.email || 'No Email'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <select 
                                                className="dash-select" 
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                            >
                                                <option value="User">User</option>
                                                <option value="Admin">Admin</option>
                                                <option value="Super Admin">Super Admin</option>
                                            </select>
                                        </td>
                                        <td>{new Date(user.createdAt).toLocaleDateString('en-GB')}</td>
                                        <td><strong>{user.ticketCount || 0}</strong></td>
                                        <td>
                                            <span className={`status-badge status-${user.status ? user.status.toLowerCase() : 'active'}`}>
                                                {user.status || 'Active'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-btns">
                                                <button 
                                                    className={user.status === 'Active' ? 'del-btn' : 'edit-btn'}
                                                    onClick={() => handleStatusToggle(user._id, user.status)}
                                                >
                                                    {user.status === 'Active' ? <UserX size={18} /> : <UserCheck size={18} />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{textAlign: 'center', padding: '40px', color: '#94a3b8'}}>
                                        No users found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default UserManagement;