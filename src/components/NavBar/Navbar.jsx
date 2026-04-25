import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService.js';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(
    localStorage.getItem('username') ? localStorage.getItem('username') : null,
  );
  const [isOrganization, setIsOrganization] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      setUsername(localStorage.getItem('username'));
      setIsOrganization(localStorage.getItem('role') === 'petition_user' ? true : false);
    };

    // Sprawdzaj zmiany w localStorage
    window.addEventListener('storage', handleStorageChange);

    // Sprawdzaj przy mount'owaniu
    handleStorageChange();

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUsername(null);
    setIsOrganization(false);
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
            <li className="welcome-msg">Witaj, {username}!</li>
            {isOrganization && (
              <li>
                <Link to="/petition/create" className="nav-btn-primary create-petition-btn">
                  + Utwórz petycję
                </Link>
              </li>
            )}
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
