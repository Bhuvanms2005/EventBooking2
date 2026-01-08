import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom'; // Ensure Link is imported
import { Ticket, Mail, Lock, User, Menu, X, ArrowRight, Calendar, MapPin } from 'lucide-react';
import '../styles/AuthPage.css';

const AuthPage = () => {
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [signupData, setSignupData] = useState({ name: '', email: '', password: '' });
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [recommended, setRecommended] = useState([]);
    
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/events";

    useEffect(() => {
        const fetchRecommended = async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/events/public/all`);
            setRecommended(res.data.slice(0, 3));
        };
        fetchRecommended();
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, loginData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate(from, { replace: true });
        } catch (err) {
            alert(err.response?.data?.message || "Login Failed");
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, signupData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate(from, { replace: true });
        } catch (err) {
            alert(err.response?.data?.message || "Signup Failed");
        }
    };

    return (
        <div className="auth-page-container">
            <nav className="user-nav">
                <div className="nav-content">
                    <Link to="/" className="nav-logo-area">
                        <Ticket color="#ffbd2e" fill="#ffbd2e" size={28} />
                        <span className="nav-logo">EventPro</span>
                    </Link>
                    <div className={`nav-links-center ${isMenuOpen ? 'open' : ''}`}>
                        <Link to="/">Home</Link>
                        <Link to="/events">Events</Link>
                        <Link to="/my-bookings">My Bookings</Link>
                        <Link to="/about">About</Link>
                    </div>
                    <button className="mobile-menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={28} color="white"/> : <Menu size={28} color="white"/>}
                    </button>
                </div>
            </nav>

            <header className="auth-header">
                <h1>Welcome <span className="highlight">To EventPro</span></h1>
                <p>Login or create an account to book your next experience</p>
            </header>

            <main className="auth-main">
                <div className="auth-card-container">
                    {/* LOGIN CARD */}
                    <div className="auth-card">
                        <img src="https://cdni.iconscout.com/illustration/premium/thumb/user-login-4268415-3551762.png" alt="Login" className="auth-illus" />
                        <h2>Login</h2>
                        <p className="auth-subtext">Welcome back! Please enter your details.</p>
                        <form onSubmit={handleLogin}>
                            <div className="auth-input-group">
                                <Mail size={18} />
                                <input type="email" placeholder="Email Address" required 
                                    onChange={(e) => setLoginData({...loginData, email: e.target.value})} />
                            </div>
                            <div className="auth-input-group">
                                <Lock size={18} />
                                <input type="password" placeholder="Password" required 
                                    onChange={(e) => setLoginData({...loginData, password: e.target.value})} />
                            </div>
                            <div className="auth-aux">
                                <label><input type="checkbox" /> Remember me</label>
                                {/* UPDATED: Linked to Forgot Password */}
                                <Link to="/forgot-password" size={18} className="forgot-pass">Forgot Password?</Link>
                            </div>
                            <button type="submit" className="auth-btn">Login Now</button>
                        </form>
                    </div>

                    {/* SIGNUP CARD */}
                    <div className="auth-card">
                        <img src="https://cdni.iconscout.com/illustration/premium/thumb/sign-up-4486361-3723267.png" alt="Signup" className="auth-illus" />
                        <h2>Sign Up</h2>
                        <p className="auth-subtext">New here? Join us for exclusive event access.</p>
                        <form onSubmit={handleSignup}>
                            <div className="auth-input-group">
                                <User size={18} />
                                <input type="text" placeholder="Full Name" required 
                                    onChange={(e) => setSignupData({...signupData, name: e.target.value})} />
                            </div>
                            <div className="auth-input-group">
                                <Mail size={18} />
                                <input type="email" placeholder="Email Address" required 
                                    onChange={(e) => setSignupData({...signupData, email: e.target.value})} />
                            </div>
                            <div className="auth-input-group">
                                <Lock size={18} />
                                <input type="password" placeholder="Password" required 
                                    onChange={(e) => setSignupData({...signupData, password: e.target.value})} />
                            </div>
                            <button type="submit" className="auth-btn signup-btn">Create Account</button>
                        </form>
                        {/* UPDATED: Linked to Terms page */}
                        <p className="legal-text">By signing up, you agree to our <Link to="/terms">Terms & Privacy</Link></p>
                    </div>
                </div>

                <section className="auth-recommended">
                    <h3>You Might Also Like</h3>
                    <div className="rec-grid">
                        {recommended.map(event => (
                            <div key={event._id} className="rec-card" onClick={() => navigate(`/event/${event._id}`)}>
                                <img
  src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${event.image}`}
  alt={event.title}
  className="event-thumb"
/>
                                <div className="rec-info">
                                    <h4>{event.title}</h4>
                                    <p><MapPin size={14}/> {event.location}</p>
                                    <div className="rec-footer">
                                        <span>₹{event.price}</span>
                                        <ArrowRight size={16} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AuthPage;