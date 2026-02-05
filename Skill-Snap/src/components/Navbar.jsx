import { useState } from "react";
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Map, Briefcase, User, LogOut, Sparkles } from 'lucide-react';
import axios from 'axios';

export default function Navigation() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const getNameFromToken = (t) => {
    if (!t) return null;
    try {
      const payload = t.split('.')[1];
      const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      return json.name || json.username || null;
    } catch {
      return null;
    }
  };
  const token = localStorage.getItem('token');
  const name = getNameFromToken(token) || localStorage.getItem('name') || 'Guest';

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const deleteAccount = async () => {
  try {
    const token = localStorage.getItem("token");

    await axios.delete("http://localhost:5000/api/auth/delete", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    localStorage.clear();
    window.location.href = "/login";
  } catch (err) {
    alert("Failed to delete account");
    console.error(err);
  }
};


  return (
    <nav className="nav-container">
      <div className="nav-content">

        {/* Brand */}
        <div className="nav-brand">
          <span className="brand-icon">🌻</span>
          <span className="brand-text">SkillSnap</span>
        </div>

        {/* Main links */}
        <div className="nav-links">
          <NavLink
            to="/"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Home size={18} />
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/roadmap"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Map size={18} />
            <span>Roadmap</span>
          </NavLink>

          <NavLink
            to="/portfolio"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Briefcase size={18} />
            <span>Portfolio</span>
          </NavLink>
        </div>

        {/* User actions */}
     {/* User dropdown */}
<div className="user-menu">
  <button className="user-btn" onClick={() => setOpen(!open)}>
    <span className="user-avatar">👤</span>
    <span className="user-name">{name}</span>
    <span className={`chevron ${open ? "rotate" : ""}`}>⌄</span>
  </button>

  {open && (
    <div className="user-dropdown">
      <button className="dropdown-item" onClick={handleLogout}>
        Logout
      </button>
      <button className="dropdown-item danger" onClick={deleteAccount}>
        Delete Account
      </button>
    </div>
  )}
</div>


      </div>
    </nav>
  );
}
