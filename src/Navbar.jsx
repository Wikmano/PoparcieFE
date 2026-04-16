import './Navbar.css';

function Navbar() {
  return (
   <nav className="navbar">
     <div className='navbar-logo'>
        <div className="logo-title">
            <span className="logo-m">M</span>Poparcie
        </div>
       <span>Głosujesz i decydujesz</span>
       </div>
  
      <ul className="navbar-links">
         <li><a href="#home">Start</a></li>
         <li><a href="#about">O projekcie</a></li>
          <li><a href="#organizations">Organizacje</a></li>
       </ul>
    </nav>
    );
 }
  
 export default Navbar;