import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Ticket, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import '../App.css';

const AuthPage = () => {
  const [tab, setTab] = useState('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/events';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, loginData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    if (signupData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, signupData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      {/* Minimal Nav */}
      <nav style={{ height: 'var(--nav-height)', background: 'var(--white)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 5%' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '1.3rem', color: 'var(--text-primary)' }}>
          <Ticket size={20} color="#5b47e0" fill="#5b47e0" />
          Event<span style={{ color: '#5b47e0' }}>Pro</span>
        </Link>
      </nav>

      {/* Auth Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 20px' }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          {/* Card */}
          <div style={{ background: 'var(--white)', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)', overflow: 'hidden' }}>
            {/* Tab header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid var(--border)' }}>
              {['login', 'signup'].map(t => (
                <button key={t} onClick={() => { setTab(t); setError(''); }} style={{ padding: '18px', border: 'none', background: tab === t ? 'var(--white)' : 'var(--bg)', fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '0.95rem', color: tab === t ? 'var(--accent)' : 'var(--text-muted)', cursor: 'pointer', borderBottom: tab === t ? '2px solid var(--accent)' : '2px solid transparent', transition: 'all 0.2s', textTransform: 'capitalize' }}>
                  {t === 'login' ? 'Sign In' : 'Create Account'}
                </button>
              ))}
            </div>

            <div style={{ padding: '32px' }}>
              {error && <div className="status-msg error" style={{ marginBottom: '20px' }}>{error}</div>}

              {tab === 'login' ? (
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <InputField icon={<Mail size={17} />} type="email" placeholder="Email address" value={loginData.email} onChange={v => setLoginData({...loginData, email: v})} required />
                  <InputField icon={<Lock size={17} />} type={showPwd ? 'text' : 'password'} placeholder="Password" value={loginData.password} onChange={v => setLoginData({...loginData, password: v})} required suffix={<button type="button" onClick={() => setShowPwd(!showPwd)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0', lineHeight: 1 }}>{showPwd ? <EyeOff size={17}/> : <Eye size={17}/>}</button>} />
                  <div style={{ textAlign: 'right', marginTop: '-8px' }}>
                    <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: '500' }}>Forgot password?</Link>
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px', borderRadius: '12px', fontSize: '0.95rem', marginTop: '4px' }}>
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <InputField icon={<User size={17} />} type="text" placeholder="Full name" value={signupData.name} onChange={v => setSignupData({...signupData, name: v})} required />
                  <InputField icon={<Mail size={17} />} type="email" placeholder="Email address" value={signupData.email} onChange={v => setSignupData({...signupData, email: v})} required />
                  <InputField icon={<Lock size={17} />} type={showPwd ? 'text' : 'password'} placeholder="Password (min 6 characters)" value={signupData.password} onChange={v => setSignupData({...signupData, password: v})} required suffix={<button type="button" onClick={() => setShowPwd(!showPwd)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0', lineHeight: 1 }}>{showPwd ? <EyeOff size={17}/> : <Eye size={17}/>}</button>} />
                  <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px', borderRadius: '12px', fontSize: '0.95rem', marginTop: '4px' }}>
                    {loading ? 'Creating account...' : 'Create Account'}
                  </button>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                    By signing up, you agree to our <Link to="/terms" style={{ color: 'var(--accent)' }}>Terms & Privacy Policy</Link>
                  </p>
                </form>
              )}
            </div>
          </div>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <Link to="/" style={{ color: 'var(--accent)', fontWeight: '500' }}>← Back to EventPro</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ icon, suffix, type, placeholder, value, onChange, required }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: '12px', padding: '12px 16px', transition: 'border-color 0.2s', focusWithin: { borderColor: 'var(--accent)' } }}
    onFocus={e => e.currentTarget.style.borderColor = '#5b47e0'}
    onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
  >
    <span style={{ color: 'var(--text-muted)', flexShrink: 0, display: 'flex' }}>{icon}</span>
    <input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} required={required} style={{ background: 'none', border: 'none', outline: 'none', flex: 1, fontSize: '0.92rem', color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }} />
    {suffix && <span style={{ flexShrink: 0 }}>{suffix}</span>}
  </div>
);

export default AuthPage;