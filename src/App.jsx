import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar/Navbar.jsx';
import PetitionDetailsPage from './pages/PetitionDetail/PetitionDetailsPage.jsx';
import PetitionCreatePage from './pages/PetitionCreatePage.jsx';
import MyPetitionsPage from './pages/MyPetitionsPage/MyPetitionsPage.jsx';
import './App.css';
import LoginPage from './pages/Logins/LoginPage.jsx';
import UnifiedRegisterPage from './pages/Register/UnifiedRegisterPage.jsx';
import HomePage from './pages/HomePage/HomePage.jsx';
import AboutPage from './pages/AboutPage/AboutPage.jsx';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/petition/:id" element={<PetitionDetailsPage />} />
        <Route path="/petition/create" element={<PetitionCreatePage />} />
        <Route path="/my-petitions" element={<MyPetitionsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<UnifiedRegisterPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </div>
  );
}

export default App;
