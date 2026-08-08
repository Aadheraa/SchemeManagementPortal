import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api';
import { useAuth } from '../services/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', age: '', education: 'UG', income: '' });
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
      const { data } = await register(form);
      saveUser(data);
      navigate('/schemes');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <div className="auth-hero-tag">Government of India</div>
        <h1>Register & <span>Find Your Schemes</span></h1>
        <p>Create your profile once. Our system automatically matches you with government schemes you're eligible for based on your age, education, and income.</p>
      </div>
      <div className="auth-form-panel">
        <h2>Create account</h2>
        <p className="auth-subtitle">Fill in your details to get started</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Ravi Kumar" required />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min. 6 characters" required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Age</label>
              <input name="age" type="number" value={form.age} onChange={handleChange} placeholder="24" min="1" max="100" required />
            </div>
            <div className="form-group">
              <label>Education Level</label>
              <select name="education" value={form.education} onChange={handleChange} required>
                <option value="School">School</option>
                <option value="UG">Under Graduate (UG)</option>
                <option value="PG">Post Graduate (PG)</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Annual Income (₹)</label>
            <input name="income" type="number" value={form.income} onChange={handleChange} placeholder="250000" required />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <p className="auth-link-text">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
