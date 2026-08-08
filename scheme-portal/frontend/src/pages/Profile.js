import React, { useState } from 'react';
import { useAuth } from '../services/AuthContext';
import { updateProfile, deleteAccount } from '../services/api';

export default function Profile() {
  const { user, saveUser } = useAuth();
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    age: user?.age || '',
    education: user?.education || 'UG',
    income: user?.income || '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async e => {
    e.preventDefault();
    setLoading(true);
    setMsg(''); setError('');
    try {
      const payload = { name: form.name, age: form.age, education: form.education, income: form.income };
      if (form.password) payload.password = form.password;
      const { data } = await updateProfile(payload);
      saveUser({ ...user, ...data });
      setMsg('Profile updated successfully!');
      setEdit(false);
      setForm(f => ({ ...f, password: '' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete your account? This action cannot be undone."
  );

  if (!confirmDelete) return;

  try {
  const { data } = await deleteAccount();

  alert(data.message);

  localStorage.removeItem("user");

  window.location.href = "/login";
} catch (err) {
  alert(err.response?.data?.message || "Failed to delete account");
}
};

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="page-wrapper">
      <div className="page-container">
        <div className="page-header">
          <div className="page-header-tag">Account settings</div>
          <h1>My Profile</h1>
        </div>

        {msg && <div className="alert alert-success" style={{ marginBottom: 20 }}>✓ {msg}</div>}
        {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>{error}</div>}

        <div className="profile-grid">
          <div className="profile-card">
            <div className="profile-card-top">
              <div className="profile-avatar">{initials}</div>
              <h3>{user?.name}</h3>
              <p>{user?.email}</p>
              <span style={{ marginTop: 10, display: 'inline-block', padding: '3px 12px', borderRadius: 100, background: user?.role === 'admin' ? 'rgba(201,168,76,0.3)' : 'rgba(26,107,74,0.3)', color: user?.role === 'admin' ? '#e8c96a' : '#6dcca0', fontSize: '0.75rem', fontWeight: 700 }}>
                {user?.role?.toUpperCase()}
              </span>
            </div>
            <div className="profile-info">
              <div className="profile-info-row">
                <span className="label">Age</span>
                <span className="value">{user?.age} years</span>
              </div>
              <div className="profile-info-row">
                <span className="label">Education</span>
                <span className="value">{user?.education}</span>
              </div>
              <div className="profile-info-row">
                <span className="label">Annual Income</span>
                <span className="value">₹{user?.income?.toLocaleString()}</span>
              </div>
              <div className="profile-info-row">
                <span className="label">Member Since</span>
                <span className="value">{new Date(user?.createdAt || Date.now()).getFullYear()}</span>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 32 }}>
            <div className="section-header">
              <h2>Edit Information</h2>
              {!edit && (
                <button className="btn btn-secondary btn-sm" onClick={() => setEdit(true)}>✏️ Edit</button>
              )}
            </div>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} disabled={!edit} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Age</label>
                  <input name="age" type="number" value={form.age} onChange={handleChange} disabled={!edit} required />
                </div>
                <div className="form-group">
                  <label>Education</label>
                  <select name="education" value={form.education} onChange={handleChange} disabled={!edit}>
                    <option value="School">School</option>
                    <option value="UG">Under Graduate</option>
                    <option value="PG">Post Graduate</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Annual Income (₹)</label>
                <input name="income" type="number" value={form.income} onChange={handleChange} disabled={!edit} required />
              </div>
              {edit && (
                <div className="form-group">
                  <label>New Password (leave blank to keep current)</label>
                  <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" />
                </div>
              )}
              {edit && (
                <div style={{ display: 'flex', gap: 12 , alignItems:'center'}}>
                  <button className="btn btn-primary" type="submit" style={{ width: 'auto' }} disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setEdit(false)}>Cancel</button>
                  <button type="button" onClick={handleDelete} className="btn"style={{background: "#dc3545",color: "#fff",width: "auto"}}>Delete Account</button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
