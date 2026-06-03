import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock } from 'lucide-react';

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleReset = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/auth/reset-password/${token}`, { password });
            alert("Password Reset Successful!");
            navigate('/login');
        } catch (err) {
            alert("Link expired or invalid");
        }
    };

    return (
        <div className="auth-page-container">
            <div className="auth-card" style={{maxWidth: '400px', margin: '100px auto'}}>
                <h2>Set New Password</h2>
                <form onSubmit={handleReset}>
                    <div className="auth-input-group">
                        <Lock size={18} />
                        <input type="password" placeholder="New Password" required onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="auth-btn">Update Password</button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;