import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar/Navbar.jsx';
import PetitionDetailsPage from './pages/PetitionDetail/PetitionDetailsPage.jsx';
import './App.css';
import UserLoginPage from './pages/UserLogin/UserLoginPage.jsx';
import RegisterPage from './pages/Register/RegisterPage.jsx';
import OrganizationsPage from './pages/Organizations/OrganizationsPage.jsx';
import OrganizationLoginPage from './pages/OrganizationLogin/OrganizationLoginPage.jsx';
import HomePage from './pages/HomePage/HomePage.jsx';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/petition/:id" element={<PetitionDetailsPage />} />
        <Route path="/login" element={<UserLoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/organizations" element={<OrganizationsPage />} />
        <Route path="/organization-login" element={<OrganizationLoginPage />} />
      </Routes>
    </div>
  );
}

export default App;
