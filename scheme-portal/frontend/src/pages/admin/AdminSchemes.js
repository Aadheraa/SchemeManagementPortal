import React, { useState, useEffect } from 'react';
import { getAllSchemes, createScheme, updateScheme, deleteScheme } from '../../services/api';

const emptyForm = { title: '', description: '', category: 'UG', minAge: '', maxIncome: '', eligibilityText: '', deadline: '' };

function SchemeModal({ scheme, onClose, onSave }) {
  const [form, setForm] = useState(scheme || emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (scheme?._id) await updateScheme(scheme._id, form);
      else await createScheme(form);
      onSave();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>{scheme?._id ? 'Edit Scheme' : 'Add New Scheme'}</h3>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input name="title" value={form.title} onChange={handleChange} required placeholder="PM Scholarship Scheme" />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} required placeholder="Brief description..." />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={form.category} onChange={handleChange} required>
                <option value="School">School</option>
                <option value="UG">Under Graduate (UG)</option>
                <option value="PG">Post Graduate (PG)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Minimum Age</label>
              <input name="minAge" type="number" value={form.minAge} onChange={handleChange} required placeholder="18" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Max Annual Income (₹)</label>
              <input name="maxIncome" type="number" value={form.maxIncome} onChange={handleChange} required placeholder="300000" />
            </div>
            <div className="form-group">
              <label>Deadline</label>
              <input name="deadline" type="date" value={form.deadline?.split('T')[0] || ''} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group">
            <label>Eligibility Text</label>
            <textarea name="eligibilityText" value={form.eligibilityText} onChange={handleChange} required placeholder="Must be a UG student with family income..." />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ width: 'auto' }} disabled={loading}>
              {loading ? 'Saving...' : scheme?._id ? 'Update Scheme' : 'Create Scheme'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminSchemes() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'add' | scheme object
  const [confirmDel, setConfirmDel] = useState(null);

  const fetchSchemes = () => {
    getAllSchemes()
      .then(({ data }) => setSchemes(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(fetchSchemes, []);

  const handleDelete = async (id) => {
    try {
      await deleteScheme(id);
      setConfirmDel(null);
      fetchSchemes();
    } catch (err) { alert('Delete failed'); }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-tag">Content Management</div>
        <h1>Manage Schemes</h1>
      </div>

      <div className="section-header">
        <span style={{ color: '#888', fontSize: '0.87rem' }}>{schemes.length} schemes total</span>
        <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => setModal('add')}>
          + Add Scheme
        </button>
      </div>

      {loading ? (
        <div className="loading-spinner"><div className="spinner"></div></div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Min Age</th>
                <th>Max Income</th>
                <th>Deadline</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {schemes.map(s => (
                <tr key={s._id}>
                  <td><strong>{s.title}</strong></td>
                  <td>
                    <span className={`scheme-category-badge ${s.category === 'School' ? 'badge-school' : s.category === 'UG' ? 'badge-ug' : 'badge-pg'}`}>
                      {s.category}
                    </span>
                  </td>
                  <td>{s.minAge}+</td>
                  <td>₹{s.maxIncome?.toLocaleString()}</td>
                  <td style={{ fontFamily: 'Space Mono', fontSize: '0.8rem' }}>
                    {new Date(s.deadline).toLocaleDateString('en-IN')}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => setModal(s)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => setConfirmDel(s)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <SchemeModal
          scheme={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSave={() => { setModal(null); fetchSchemes(); }}
        />
      )}

      {confirmDel && (
        <div className="modal-overlay" onClick={() => setConfirmDel(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <h3>Confirm Delete</h3>
            <p style={{ marginBottom: 24, color: '#666' }}>
              Are you sure you want to delete <strong>"{confirmDel.title}"</strong>? This action cannot be undone.
            </p>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setConfirmDel(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(confirmDel._id)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
