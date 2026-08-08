import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div style={{ padding: '0 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', fontFamily: 'Space Mono', letterSpacing: '0.1em' }}>ADMIN PANEL</p>
        </div>

        <p className="sidebar-section-title">Overview</p>
        <NavLink to="/admin" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          📊 Dashboard
        </NavLink>

        <p className="sidebar-section-title">Manage</p>
        <NavLink to="/admin/schemes" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          📋 Schemes
        </NavLink>
        <NavLink to="/admin/applications" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          📁 Applications
        </NavLink>
        <NavLink to="/admin/users" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          👥 Users
        </NavLink>

        <p className="sidebar-section-title">Account</p>
        <button className="sidebar-link" onClick={handleLogout} style={{ color: '#ff8b80' }}>
          🚪 Logout
        </button>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
