import React, { useState } from 'react';
import axios from 'axios'; // Added missing import
import { Mail, ArrowLeft, Send, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/AuthPage.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(''); // Clear previous errors
        
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, { email });
            setSent(true);
        } catch (err) {
            // Set the error message to state instead of an alert
            setError(err.response?.data?.message || "Failed to send reset link. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page-container">
            <div className="auth-main" style={{marginTop: '100px'}}>
                <div className="auth-card" style={{maxWidth: '450px', margin: '0 auto'}}>
                    <Link to="/login" className="back-link" style={{display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '20px', textDecoration: 'none', color: '#6366f1'}}>
                        <ArrowLeft size={18}/> Back to Login
                    </Link>
                    
                    {!sent ? (
                        <>
                            <h2>Forgot Password?</h2>
                            <p className="auth-subtext">Enter your registered email and we'll send you a reset link.</p>
                            
                            {/* ON-SCREEN ERROR MESSAGE */}
                            {error && (
                                <div style={{background: '#fee2e2', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem'}}>
                                    <AlertCircle size={18} /> {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="auth-input-group">
                                    <Mail size={18} />
                                    <input 
                                        type="email" 
                                        placeholder="Enter your email" 
                                        required 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        disabled={loading}
                                    />
                                </div>
                                <button type="submit" className="auth-btn" style={{marginTop: '10px'}} disabled={loading}>
                                    {loading ? "Sending..." : "Send Reset Link"}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="success-state" style={{textAlign: 'center'}}>
                            <Send size={50} color="#10b981" />
                            <h2 style={{marginTop: '20px'}}>Check your Email</h2>
                            <p className="auth-subtext">We have sent a password recovery link to <strong>{email}</strong></p>
                            <button onClick={() => setSent(false)} className="auth-btn">Resend Link</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;