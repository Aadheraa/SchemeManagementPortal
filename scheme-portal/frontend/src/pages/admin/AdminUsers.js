import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../../services/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllUsers()
      .then(({ data }) => setUsers(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const eduColor = (edu) => ({ School: 'badge-school', UG: 'badge-ug', PG: 'badge-pg' }[edu] || 'badge-ug');
  const initials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div>
      <div className="page-header">
        <div className="page-header-tag">User Management</div>
        <h1>Registered Users</h1>
        <p>All citizens registered on the portal.</p>
      </div>

      {loading ? (
        <div className="loading-spinner"><div className="spinner"></div></div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Age</th>
                <th>Education</th>
                <th>Annual Income</th>
                <th>Registered</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--ink)' }}>
                        {initials(u.name)}
                      </div>
                      <strong>{u.name}</strong>
                    </div>
                  </td>
                  <td style={{ color: '#888', fontSize: '0.85rem' }}>{u.email}</td>
                  <td>{u.age} yrs</td>
                  <td>
                    <span className={`scheme-category-badge ${eduColor(u.education)}`}>{u.education}</span>
                  </td>
                  <td style={{ fontFamily: 'Space Mono', fontSize: '0.85rem' }}>₹{u.income?.toLocaleString()}</td>
                  <td style={{ fontFamily: 'Space Mono', fontSize: '0.8rem', color: '#888' }}>
                    {new Date(u.createdAt).toLocaleDateString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
