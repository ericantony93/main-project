import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="nav">
      <div className="nav-brand">AQI Monitor</div>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/demo">Live Demo</Link>
        <Link to="/buy" className="buy-btn">Buy</Link>
      </div>
    </nav>
  );
}