import React from 'react';
import { useState } from 'react';
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
  {
    id: 1,
    title: 'Petycja o ochronę środowiska',
    author: 'Jan Kowalski',
    votes: 150,
    target: 500,
    category: 'Ekologia',
    createdAt: '2026-03-15',
  },
  {
    id: 2,
    title: 'Petycja o lepsze drogi',
    author: 'Anna Nowak',
    votes: 200,
    target: 400,
    category: 'Infrastruktura',
    createdAt: '2026-03-16',
  },
  {
    id: 3,
    title: 'Petycja o edukację',
    author: 'Piotr Wiśniewski',
    votes: 80,
    target: 300,
    category: 'Edukacja',
    createdAt: '2026-03-17',
  },
  {
    id: 4,
    title: 'Petycja o zdrowie',
    author: 'Maria Zielińska',
    votes: 120,
    target: 600,
    category: 'Zdrowie',
    createdAt: '2026-03-18',
  },
];

function PetitionList({ petitions }) {
  return (
    <div className="petition-grid">
      {petitions.map((petition) => (
        <PetitionCard key={petition.id} petition={petition} />
      ))}
    </div>
  );
}

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const filteredPetitions = petitions
    .filter((petition) => {
      const matchesSearch =
        petition.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        petition.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || petition.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortBy === 'mostVotes') {
        return b.votes - a.votes;
      }
      return 0;
    });

  return (
    <div className="app-container">
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <main className="content">
              <h1>Petycje</h1>
              <div className="filters-wrapper">
                <div className="filters-container">
                  <input
                    type="text"
                    placeholder="Szukaj petycji..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="filter-select"
                  >
                    <option value="All">Wszystkie kategorie</option>
                    <option value="Ekologia">Ekologia</option>
                    <option value="Infrastruktura">Infrastruktura</option>
                    <option value="Edukacja">Edukacja</option>
                    <option value="Zdrowie">Zdrowie</option>
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="filter-select"
                  >
                    <option value="newest">Najnowsze</option>
                    <option value="oldest">Najstarsze</option>
                    <option value="mostVotes">Najwięcej głosów</option>
                  </select>
                </div>
              </div>
              <PetitionList petitions={filteredPetitions} />
            </main>
          }
        />
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
