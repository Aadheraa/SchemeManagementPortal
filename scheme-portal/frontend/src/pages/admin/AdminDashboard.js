import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(({ data }) => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;

  const cards = [
    { label: 'Total Users', value: stats?.totalUsers, icon: '👥', cls: 'green' },
    { label: 'Total Schemes', value: stats?.totalSchemes, icon: '📋', cls: 'gold' },
    { label: 'Total Applications', value: stats?.totalApplications, icon: '📁', cls: 'sky' },
    { label: 'Pending', value: stats?.pending, icon: '⏳', cls: 'orange' },
    { label: 'Approved', value: stats?.approved, icon: '✅', cls: 'green' },
    { label: 'Rejected', value: stats?.rejected, icon: '❌', cls: 'crimson' },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="page-header-tag">Admin Overview</div>
        <h1>Dashboard</h1>
        <p>Real-time metrics for the Scheme Management Portal.</p>
      </div>

      <div className="dashboard-stats">
        {cards.map(c => (
          <div key={c.label} className={`stat-card ${c.cls}`}>
            <span className="stat-icon">{c.icon}</span>
            <div className="stat-value">{c.value ?? 0}</div>
            <div className="stat-label">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 28 }}>
        <h3 style={{ marginBottom: 16, fontWeight: 700 }}>Application Overview</h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[
            { label: 'Pending', val: stats?.pending, color: '#e67e22', bg: '#fff3cd' },
            { label: 'Approved', val: stats?.approved, color: '#27ae60', bg: '#d1e7dd' },
            { label: 'Rejected', val: stats?.rejected, color: '#c0392b', bg: '#f8d7da' },
          ].map(b => (
            <div key={b.label} style={{ flex: 1, minWidth: 120, background: b.bg, borderRadius: 12, padding: '20px 24px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: b.color, fontFamily: 'Space Mono' }}>{b.val ?? 0}</div>
              <div style={{ fontSize: '0.8rem', color: b.color, fontWeight: 600, marginTop: 4 }}>{b.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
