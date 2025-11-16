import { NavLink } from 'react-router-dom';
import { Home, Map, Briefcase } from 'lucide-react';

export default function Navigation() {
  return (
    <nav className="nav-container">
      <div className="nav-content">
        <div className="nav-brand">
          <span className="brand-icon">🌻</span>
          <span className="brand-text">SkillSnap</span>
        </div>
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
      </div>
    </nav>
  );
}
