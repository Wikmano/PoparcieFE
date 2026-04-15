import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  return (
    <div className='app-container'>
      {/* PASEK NAWIGACJI */}
      <nav className="navbar">
        <div className='navbar-logo'>
          MPoparcie <span>To ty jesteś głosem!</span>
        </div>

        <div className="navbar-assets">
          <img src={heroImg} className="base" width="50" height="53" alt="" />
          <img src={reactLogo} className="framework" width="30" alt="React logo" />
          <img src={viteLogo} className="vite" width="30" alt="Vite logo" />
        </div>

        <ul className="navbar-links">
          <li><a href="#home">Start</a></li>
          <li><a href="#about">O projekcie</a></li>
          <li><a href="#form">Zagłosuj</a></li>
        </ul>
      </nav>

      {/* TREŚĆ GŁÓWNA */}
      <main className="content">
        <h1>Petycja</h1>
        <p>Tutaj wkrótce pojawi się formularz zbierania podpisów.</p>
      </main>
    </div>      
  )  
}

export default App
