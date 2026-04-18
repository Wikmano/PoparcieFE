import React from 'react';
import godlo from './assets/godlo.png';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo-link">
        <div className="navbar-logo">
          <img src={godlo} alt="Godło" className="navbar-godlo" />
          <div className="navbar-brand">
            <span className="logo-name">
              <span className="logo-m">m</span>Poparcie
            </span>
            <span className="logo-slogan">Głosujesz i decydujesz</span>
          </div>
        </div>
      </Link>

      <ul className="navbar-links">
        <li>
          <Link to="/register" className="nav-btn-secondary">
            Rejestracja
          </Link>
        </li>
        <li>
          <Link to="/login" className="nav-btn-primary">
            Logowanie
          </Link>
        </li>
        <li className="dropdown">
          <span className="dropdown-toggle hamburger">
            <span></span>
            <span></span>
            <span></span>
          </span>
          <ul className="dropdown-menu">
            <li>
              <Link to="/organization-login">Logowanie organizacji</Link>
            </li>
            <li>
              <Link to="/organizations">Rejestrowanie organizacji</Link>
            </li>
            <li>
              <Link to="/about">O projekcie</Link>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
