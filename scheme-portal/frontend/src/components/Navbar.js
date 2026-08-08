import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <a className="navbar-brand" href="/">
        <span className="brand-dot"></span>
        SCHEME PORTAL
      </a>
      <div className="navbar-links">
        {user?.role === 'user' && (
          <>
            <NavLink to="/schemes" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>Schemes</NavLink>
            <NavLink to="/my-applications" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>My Applications</NavLink>
            <NavLink to="/profile" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>Profile</NavLink>
          </>
        )}
        {user?.role === 'admin' && (
          <>
            <NavLink to="/admin" end className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>Dashboard</NavLink>
            <NavLink to="/admin/schemes" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>Schemes</NavLink>
            <NavLink to="/admin/applications" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>Applications</NavLink>
            <NavLink to="/admin/users" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>Users</NavLink>
          </>
        )}
        <button className="nav-btn-logout" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
