import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar/Navbar.jsx';
import PetitionDetailsPage from './pages/PetitionDetail/PetitionDetailsPage.jsx';
import './App.css';
import LoginPage from './pages/LoginPage.jsx';
import UnifiedRegisterPage from './pages/UnifiedRegisterPage.jsx';
import HomePage from './pages/HomePage/HomePage.jsx';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/petition/:id" element={<PetitionDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<UnifiedRegisterPage />} />
      </Routes>
    </div>
  );
}

export default App;
