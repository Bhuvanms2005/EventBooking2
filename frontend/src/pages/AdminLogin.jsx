import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Ticket, Mail, Lock, Shield, Eye, EyeOff } from 'lucide-react';
import '../App.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/admin/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('adminUser', JSON.stringify(res.data.admin));
      setStatus({ type: 'success', message: 'Login successful! Redirecting...' });
      setTimeout(() => navigate('/admin/dashboard'), 1200);
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Login failed. Please check your credentials.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ height: 'var(--nav-height)', background: 'var(--white)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 5%' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '1.3rem', color: 'var(--text-primary)' }}>
          <Ticket size={20} color="#5b47e0" fill="#5b47e0"/>Event<span style={{ color: '#5b47e0' }}>Pro</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', background: 'var(--bg)', padding: '6px 14px', borderRadius: '9999px', border: '1px solid var(--border)' }}>
          <Shield size={14} color="#5b47e0"/> Admin Panel
        </div>
      </nav>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 20px' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ width: '64px', height: '64px', background: 'var(--accent-soft)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Shield size={28} color="#5b47e0" />
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: '800', marginBottom: '6px' }}>Admin Login</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Access restricted to administrators only</p>
          </div>

          <div style={{ background: 'var(--white)', borderRadius: '20px', border: '1px solid var(--border)', padding: '32px', boxShadow: 'var(--shadow-md)' }}>
            {status.message && <div className={`status-msg ${status.type}`} style={{ marginBottom: '20px' }}>{status.message}</div>}
            
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <InputField icon={<Mail size={17}/>} type="email" placeholder="Admin email" value={email} onChange={setEmail} required />
              <InputField icon={<Lock size={17}/>} type={showPwd ? 'text' : 'password'} placeholder="Password" value={password} onChange={setPassword} required
                suffix={<button type="button" onClick={() => setShowPwd(!showPwd)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', lineHeight: 1 }}>{showPwd ? <EyeOff size={17}/> : <Eye size={17}/>}</button>}
              />
              <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px', borderRadius: '12px', fontSize: '0.95rem', marginTop: '4px' }}>
                {loading ? 'Signing in...' : 'Sign In to Admin'}
              </button>
            </form>
          </div>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <Link to="/" style={{ color: 'var(--accent)', fontWeight: '500' }}>← Back to EventPro</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ icon, suffix, type, placeholder, value, onChange, required }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: '12px', padding: '12px 16px', transition: 'border-color 0.2s' }}
    onFocus={e => e.currentTarget.style.borderColor = '#5b47e0'}
    onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
  >
    <span style={{ color: 'var(--text-muted)', flexShrink: 0, display: 'flex' }}>{icon}</span>
    <input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} required={required} style={{ background: 'none', border: 'none', outline: 'none', flex: 1, fontSize: '0.92rem', color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}/>
    {suffix}
  </div>
);

export default AdminLogin;