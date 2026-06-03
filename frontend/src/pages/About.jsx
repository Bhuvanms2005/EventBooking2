import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Ticket, Users, Award, ShieldCheck, Menu, X } from 'lucide-react';
import '../styles/About.css';

const About = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="about-page-wrapper">
            {/* Nav Section */}
            <nav className="user-nav">
                <div className="nav-content">
                    <Link to="/" className="nav-logo-area">
                        <Ticket color="#ffbd2e" fill="#ffbd2e" size={28} />
                        <span className="nav-logo">EventPro</span>
                    </Link>
                    
                    <div className={`nav-links-center ${isMenuOpen ? 'open' : ''}`}>
                        <NavLink to="/" onClick={() => setIsMenuOpen(false)}>Home</NavLink>
                        <NavLink to="/events" onClick={() => setIsMenuOpen(false)}>Events</NavLink>
                        <NavLink to="/my-bookings" onClick={() => setIsMenuOpen(false)}>My Bookings</NavLink>
                        <NavLink to="/about" className="active" onClick={() => setIsMenuOpen(false)}>About</NavLink>
                    </div>

                    <div className="nav-right-actions">
                        <NavLink to="/login" className="login-pill">Login / Profile</NavLink>
                        <button className="mobile-menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X size={28} color="white"/> : <Menu size={28} color="white"/>}
                        </button>
                    </div>
                </div>
            </nav>

            <div className="about-container">
                <section className="about-hero">
                    <h1>Redefining <span className="highlight">Experiences</span></h1>
                    <p>Connecting thousands of people to the best concerts, workshops, and festivals across the country.</p>
                </section>

                <section className="about-stats">
                    <div className="stat-card"><h3>100+</h3><p>Cities</p></div>
                    <div className="stat-card"><h3>500+</h3><p>Events Monthly</p></div>
                    <div className="stat-card"><h3>50k+</h3><p>Happy Users</p></div>
                </section>

                <section className="about-mission">
                    <div className="mission-text">
                        <h2>Our Mission</h2>
                        <p>We started EventPro with a simple goal: to make discovering and booking events as seamless as possible. Whether it's a small local workshop or a massive stadium concert, we believe every experience matters.</p>
                    </div>
                    <div className="mission-features">
                        <div className="feat"><ShieldCheck color="#6366f1"/> <span>Secure Booking</span></div>
                        <div className="feat"><Users color="#6366f1"/> <span>Community Driven</span></div>
                        <div className="feat"><Award color="#6366f1"/> <span>Verified Organizers</span></div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default About;