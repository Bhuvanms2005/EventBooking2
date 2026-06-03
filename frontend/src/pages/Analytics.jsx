import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, NavLink } from 'react-router-dom';
import { 
    Line, Doughnut 
} from 'react-chartjs-2';
import { 
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, 
    LineElement, Title, Tooltip, Legend, ArcElement 
} from 'chart.js';
import { 
    Ticket, LayoutDashboard, Calendar, Users, 
    BarChart3, Download, TrendingUp, ArrowLeft, ShieldAlert 
} from 'lucide-react';
import '../styles/UserManagement.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const Analytics = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/analytics`);
                setData(res.data);
                setLoading(false);
            } catch (err) {
                setLoading(false);
                setStatusMsg({ type: 'error', text: 'Analytics engine failed to load.' });
            }
        };
        fetchAnalytics();
    }, []);

    const revenueChartData = {
        labels: data?.timelineData?.map(d => d.label) || [],
        datasets: [{
            label: 'Revenue (₹)',
            data: data?.timelineData?.map(d => d.revenue) || [],
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            fill: true,
            tension: 0.4
        }]
    };

    const categoryChartData = {
        labels: data?.categoryData?.map(d => d._id) || [],
        datasets: [{
            data: data?.categoryData?.map(d => d.revenue) || [],
            backgroundColor: ['#6366f1', '#ffbd2e', '#10b981', '#f43f5e', '#8b5cf6'],
            borderWidth: 0
        }]
    };

    if (loading) return <div className="loading-screen">Processing Big Data...</div>;

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
                        <NavLink to="/admin/analytics" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                            <BarChart3 size={18}/> Analytics
                        </NavLink>
                    </div>
                </div>
            </nav>

            <div className="breadcrumb-bar">
                <Link to="/admin/dashboard" style={{textDecoration:'none', color:'inherit'}}>Admin Panel</Link> &nbsp; &gt; &nbsp; Analytics
            </div>

            <header className="dashboard-hero">
                <div className="hero-text">
                    <div style={{display:'flex', alignItems:'center', gap:'15px', marginBottom:'10px'}}>
                        <Link to="/admin/dashboard" className="btn-back-circle">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1>Financial Insights</h1>
                    </div>
                    <p>Real-time visualization of platform revenue and category performance.</p>
                </div>
                <button className="apply-btn" onClick={() => window.print()} style={{display:'flex', alignItems:'center', gap:'10px'}}>
                    <Download size={18} /> Export PDF
                </button>
            </header>

            <main className="events-list-container">
                {statusMsg.text && (
                    <div className={`status-banner ${statusMsg.type === 'error' ? 'status-error' : 'status-success'}`}>
                        {statusMsg.type === 'error' && <ShieldAlert size={18} />}
                        {statusMsg.text}
                    </div>
                )}

                <div className="analytics-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '25px'}}>
                    <div className="events-table-card">
                        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
                            <h3>Revenue Growth</h3>
                            <TrendingUp color="#10b981" />
                        </div>
                        <div style={{height: '300px'}}>
                            <Line data={revenueChartData} options={{ maintainAspectRatio: false }} />
                        </div>
                    </div>

                    <div className="events-table-card">
                        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
                            <h3>Revenue by Category</h3>
                        </div>
                        <div style={{height: '300px', display: 'flex', justifyContent: 'center'}}>
                            <Doughnut data={categoryChartData} options={{ maintainAspectRatio: false }} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Analytics;