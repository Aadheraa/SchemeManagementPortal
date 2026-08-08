import React, { useState, useEffect } from 'react';
import { getAllApplications, updateApplicationStatus } from '../../services/api';

export default function AdminApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchApps = () => {
    getAllApplications()
      .then(({ data }) => setApps(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(fetchApps, []);

  const handleStatus = async (status) => {
    setUpdating(true);
    try {
      await updateApplicationStatus(selected._id, { status, remarks });
      setSelected(null);
      setRemarks('');
      fetchApps();
    } catch (err) { alert('Update failed'); }
    finally { setUpdating(false); }
  };

  const statusClass = s => ({ Pending: 'status-pending', Approved: 'status-approved', Rejected: 'status-rejected' }[s]);

  return (
    <div>
      <div className="page-header">
        <div className="page-header-tag">Application Review</div>
        <h1>All Applications</h1>
        <p>Review and update application statuses.</p>
      </div>

      {loading ? (
        <div className="loading-spinner"><div className="spinner"></div></div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Email</th>
                <th>Scheme</th>
                <th>Category</th>
                <th>Applied On</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {apps.map(app => (
                <tr key={app._id}>
                  <td><strong>{app.user?.name}</strong></td>
                  <td style={{ color: '#888', fontSize: '0.83rem' }}>{app.user?.email}</td>
                  <td>{app.scheme?.title}</td>
                  <td>
                    <span className={`scheme-category-badge ${app.scheme?.category === 'School' ? 'badge-school' : app.scheme?.category === 'UG' ? 'badge-ug' : 'badge-pg'}`}>
                      {app.scheme?.category}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'Space Mono', fontSize: '0.8rem' }}>
                    {new Date(app.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td>
                    <span className={`status-badge ${statusClass(app.status)}`}>{app.status}</span>
                  </td>
                  <td>
                    <button className="btn btn-secondary btn-sm" onClick={() => { setSelected(app); setRemarks(app.remarks || ''); }}>
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Review Application</h3>
            <div style={{ background: '#f5f4f0', borderRadius: 10, padding: 16, marginBottom: 20 }}>
              <p style={{ fontWeight: 700, marginBottom: 4 }}>{selected.scheme?.title}</p>
              <p style={{ fontSize: '0.85rem', color: '#666' }}>
                Applicant: <strong>{selected.user?.name}</strong> ({selected.user?.email})<br />
                Education: {selected.user?.education} | Income: ₹{selected.user?.income?.toLocaleString()} | Age: {selected.user?.age}
              </p>
              {selected.document && (
                <p style={{ marginTop: 8, fontSize: '0.82rem' }}>
                  📎 <a href={`/uploads/${selected.document}`} target="_blank" rel="noreferrer" style={{ color: '#1a6b4a' }}>View Document</a>
                </p>
              )}
            </div>
            <div style={{ marginBottom: 6 }}>
              <span>Current Status: </span>
              <span className={`status-badge ${statusClass(selected.status)}`}>{selected.status}</span>
            </div>
            <div className="form-group" style={{ marginTop: 16 }}>
              <label>Remarks (Optional)</label>
              <textarea value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="Add a note for the applicant..." rows={3} style={{ width: '100%', padding: 12, borderRadius: 10, border: '1.5px solid #e0ddd6', fontFamily: 'Sora', fontSize: '0.88rem', outline: 'none' }} />
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelected(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleStatus('Rejected')} disabled={updating}>Reject</button>
              <button className="btn btn-primary" style={{ width: 'auto', background: '#27ae60' }} onClick={() => handleStatus('Approved')} disabled={updating}>Approve</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
