import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../services/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { saveUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await login(form);
      saveUser(data);
      navigate(data.role === 'admin' ? '/admin' : '/schemes');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <div className="auth-hero-tag">Government of India</div>
        <h1>Access Your <span>Scheme Benefits</span></h1>
        <p>A unified portal for citizens to discover and apply for government welfare schemes tailored to their eligibility.</p>
      </div>
      <div className="auth-form-panel">
        <h2>Welcome back</h2>
        <p className="auth-subtitle">Sign in to your account to continue</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" required />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="auth-link-text">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
        <div style={{ marginTop: 24, padding: 16, background: '#f5f4f0', borderRadius: 10, fontSize: '0.8rem', color: '#888' }}>
          <strong>Demo Admin:</strong> admin@portal.gov.in / admin123
        </div>
      </div>
    </div>
  );
}
