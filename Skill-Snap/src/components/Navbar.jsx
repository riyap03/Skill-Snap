import { Link } from 'react-router-dom'; 

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-link">Home</Link> 
      <Link to="/roadmap" className="nav-link">RoadMap</Link>
      <Link to="/portfolio" className="nav-link">Portfolio</Link>
    </nav>
  );
}

export default Navbar;
