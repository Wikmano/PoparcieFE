import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService.js';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo-link">
        <div className="navbar-logo">
          <img src="/godlo.png" alt="Godło" className="navbar-godlo" />
          <div className="navbar-brand">
            <span className="logo-name">
              <span className="logo-m">m</span>Poparcie
            </span>
            <span className="logo-slogan">Głosujesz i decydujesz</span>
          </div>
        </div>
      </Link>

      <ul className="navbar-links">
        {username ? (
          <>
            <li className="welcome-msg">Zalogowany użytkownik: {username}</li>
            <li>
              <button onClick={handleLogout} className="nav-btn-secondary logout-btn">
                Wyloguj
              </button>
            </li>
          </>
        ) : (
          <>
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
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
