import React, { useState, useEffect } from 'react';
import { getMyApplications } from '../services/api';

export default function MyApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyApplications()
      .then(({ data }) => setApps(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statusClass = s => ({ Pending: 'status-pending', Approved: 'status-approved', Rejected: 'status-rejected' }[s]);
  const statusIcon = s => ({ Pending: '⏳', Approved: '✅', Rejected: '❌' }[s]);

  return (
    <div className="page-wrapper">
      <div className="page-container">
        <div className="page-header">
          <div className="page-header-tag">Track your progress</div>
          <h1>My Applications</h1>
          <p>View the current status of all your scheme applications.</p>
        </div>

        {loading ? (
          <div className="loading-spinner"><div className="spinner"></div></div>
        ) : apps.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <p>You haven't applied for any schemes yet. Browse the Schemes page to get started.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Scheme</th>
                  <th>Category</th>
                  <th>Applied On</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {apps.map(app => (
                  <tr key={app._id}>
                    <td><strong>{app.scheme?.title}</strong></td>
                    <td>
                      <span className={`scheme-category-badge ${app.scheme?.category === 'School' ? 'badge-school' : app.scheme?.category === 'UG' ? 'badge-ug' : 'badge-pg'}`}>
                        {app.scheme?.category}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.8rem' }}>
                      {new Date(app.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.8rem' }}>
                      {new Date(app.scheme?.deadline).toLocaleDateString('en-IN')}
                    </td>
                    <td>
                      <span className={`status-badge ${statusClass(app.status)}`}>
                        {statusIcon(app.status)} {app.status}
                      </span>
                    </td>
                    <td style={{ color: '#888', fontSize: '0.85rem' }}>
                      {app.remarks || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
