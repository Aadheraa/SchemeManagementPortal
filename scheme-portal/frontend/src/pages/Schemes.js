import React, { useState, useEffect, useCallback } from 'react';
import { getEligibleSchemes, applyScheme, getMyApplications } from '../services/api';
import { useAuth } from '../services/AuthContext';

function ApplyModal({ scheme, onClose, onSuccess, alreadyApplied }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleApply = async () => {
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('schemeId', scheme._id);
      if (file) formData.append('document', file);
      await applyScheme(formData);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>Apply for Scheme</h3>
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontWeight: 600, color: '#333', marginBottom: 6 }}>{scheme.title}</p>
          <p style={{ fontSize: '0.85rem', color: '#777' }}>{scheme.eligibilityText}</p>
        </div>
        {alreadyApplied ? (
          <div className="alert alert-success">✓ You have already applied for this scheme.</div>
        ) : (
          <>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="form-group">
              <label>Upload Supporting Document (Optional)</label>
              <div
                className={`file-upload-area ${file ? 'has-file' : ''}`}
                onClick={() => document.getElementById('doc-upload').click()}
              >
                <span style={{ fontSize: '2rem' }}>📄</span>
                <p>{file ? `✓ ${file.name}` : 'Click to upload PDF/Image (max 5MB)'}</p>
              </div>
              <input
                id="doc-upload"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                style={{ display: 'none' }}
                onChange={e => setFile(e.target.files[0])}
              />
            </div>
          </>
        )}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          {!alreadyApplied && (
            <button className="btn btn-primary" style={{ width: 'auto' }} onClick={handleApply} disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Schemes() {
  const { user } = useAuth();
  const [schemes, setSchemes] = useState([]);
  const [myApps, setMyApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchSchemes = useCallback(async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (category !== 'all') params.category = category;
      const { data } = await getEligibleSchemes(params);
      setSchemes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, category]);

  const fetchApps = async () => {
    try {
      const { data } = await getMyApplications();
      setMyApps(data.map(a => a.scheme._id));
    } catch (err) {}
  };

  useEffect(() => { fetchSchemes(); }, [fetchSchemes]);
  useEffect(() => { fetchApps(); }, []);

  useEffect(() => {
    const timer = setTimeout(fetchSchemes, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const handleSuccess = () => {
    setSelectedScheme(null);
    setSuccessMsg('Application submitted successfully!');
    fetchApps();
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const catBadge = (cat) => {
    const map = { School: 'badge-school', UG: 'badge-ug', PG: 'badge-pg' };
    return map[cat] || 'badge-ug';
  };

  const catEmoji = (cat) => ({ School: '🏫', UG: '🎓', PG: '🔬' }[cat] || '📋');

  return (
    <div className="page-wrapper">
      <div className="page-container">
        <div className="page-header">
          <div className="page-header-tag">Personalised for you</div>
          <h1>Eligible Schemes</h1>
          <p>Showing schemes matched to your profile — Age: {user?.age}, Education: {user?.education}, Income: ₹{user?.income?.toLocaleString()}</p>
        </div>

        {successMsg && <div className="alert alert-success" style={{ marginBottom: 20 }}>✓ {successMsg}</div>}

        <div className="filter-bar">
          <div className="search-input-wrap">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search schemes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="filter-chips">
            {['all', 'School', 'UG', 'PG'].map(c => (
              <button key={c} className={`chip ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>
                {c === 'all' ? 'All' : c}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loading-spinner"><div className="spinner"></div></div>
        ) : schemes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p>No eligible schemes found matching your criteria.</p>
          </div>
        ) : (
          <div className="schemes-grid">
            {schemes.map(scheme => (
              <div key={scheme._id} className="scheme-card">
                <div className="scheme-card-header">
                  <span className={`scheme-category-badge ${catBadge(scheme.category)}`}>
                    {catEmoji(scheme.category)} {scheme.category}
                  </span>
                  <h3>{scheme.title}</h3>
                </div>
                <div className="scheme-card-body">
                  <p>{scheme.description.substring(0, 120)}...</p>
                  <div className="scheme-meta">
                    <span className="scheme-meta-item">👤 Age ≥ {scheme.minAge}</span>
                    <span className="scheme-meta-item">💰 Income ≤ ₹{scheme.maxIncome.toLocaleString()}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#999', marginBottom: 0 }}>
                    <em>{scheme.eligibilityText}</em>
                  </p>
                </div>
                <div className="scheme-card-footer">
                  <span className="deadline-text">
                    📅 {new Date(scheme.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  {myApps.includes(scheme._id) ? (
                    <span className="status-badge status-approved">✓ Applied</span>
                  ) : (
                    <button className="btn btn-primary btn-sm" style={{ width: 'auto' }} onClick={() => setSelectedScheme(scheme)}>
                      Apply Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedScheme && (
        <ApplyModal
          scheme={selectedScheme}
          onClose={() => setSelectedScheme(null)}
          onSuccess={handleSuccess}
          alreadyApplied={myApps.includes(selectedScheme._id)}
        />
      )}
    </div>
  );
}
