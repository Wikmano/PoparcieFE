import godlo from './assets/godlo.png';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className='navbar-logo'>
        <img src={godlo} alt="Godło" className="navbar-godlo" />
        <div className="navbar-brand">
          <span className="logo-name"><span className="logo-m">m</span>Poparcie</span>
          <span className="logo-slogan">Głosujesz i decydujesz</span>
        </div>
      </div>

      <ul className="navbar-links">
        <li><a href="#Registration" className="nav-btn-secondary">Rejestracja</a></li>
        <li><a href="#login" className="nav-btn-primary">Logowanie</a></li>
        <li><a href="#Organizations">Organizacje</a></li>
        <li><a href="#about">O projekcie</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;
