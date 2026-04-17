import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import PetitionCard from './PetitionCard';
import PetitionDetail from './PetitionDetail';
import './App.css';
import Login from './Login';
import Register from './Register';
import Organizations from './Organizations';
import OrganizationLogin from './OrganizationLogin';

//Do zmiany na razie przykłądowe
const petitions = [
  { id: 1, title: 'Petycja o ochronę środowiska', author: 'Jan Kowalski', votes: 150, target: 500 },
  { id: 2, title: 'Petycja o lepsze drogi', author: 'Anna Nowak', votes: 200, target: 400 },
  { id: 3, title: 'Petycja o edukację', author: 'Piotr Wiśniewski', votes: 80, target: 300 },
  { id: 4, title: 'Petycja o zdrowie', author: 'Maria Zielińska', votes: 120, target: 600 },
];

function PetitionList() {
  return (
    <div className="petition-grid">
      {petitions.map(petition => (
        <PetitionCard key={petition.id} petition={petition} />
      ))}
    </div>
  );
}

function App() {
  return (
    <div className='app-container'>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <main className="content">
            <h1>Petycje</h1>
            <PetitionList />
          </main>
        } />
        <Route path="/petition/:id" element={<PetitionDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/organizations" element={<Organizations />} />
        <Route path="/organization-login" element={<OrganizationLogin />} />
      </Routes>
    </div>
  );
}

export default App;
