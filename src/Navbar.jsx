import React from 'react';
import godlo from './assets/godlo.png';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo-link">
        <div className='navbar-logo'>
          <img src={godlo} alt="Godło" className="navbar-godlo" />
          <div className="navbar-brand">
            <span className="logo-name"><span className="logo-m">m</span>Poparcie</span>
            <span className="logo-slogan">Głosujesz i decydujesz</span>
          </div>
        </div>
      </Link>

      <ul className="navbar-links">
        <li><Link to="/register" className="nav-btn-secondary">Rejestracja</Link></li>
        <li><Link to="/login" className="nav-btn-primary">Logowanie</Link></li>
        <li><Link to="/organizations">Organizacje</Link></li>
        <li><Link to="/about">O projekcie</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
