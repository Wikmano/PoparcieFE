import React, { useEffect, useMemo, useState } from 'react';
import PetitionCard from '../../components/PetitionCard/PetitionCard.jsx';
import { petitionsService } from '../../services/petitionsService.js';
import { PETITION_CATEGORIES } from '../../infrastructure/categories.js';

function HomePage() {
  const SORT_BY_NEWEST = 'newest';
  const SORT_BY_OLDEST = 'oldest';
  const SORT_BY_MOST_VOTES = 'mostVotes';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState(SORT_BY_NEWEST);
  const [petitions, setPetitions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadPetitions = async () => {
      try {
        setError('');
        setIsLoading(true);
        const data = await petitionsService.getAllPetitions();
        if (!isMounted) {
          return;
        }
        console.log(data.data);
        setPetitions(Array.isArray(data.data.petitions) ? data.data.petitions : []);
      } catch {
        if (!isMounted) {
          return;
        }
        setError('Nie udalo sie pobrac petycji');
        setPetitions([]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadPetitions();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredPetitions = useMemo(
    () =>
      petitions
        .filter((petition) => {
          const matchesSearch =
            petition.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            petition.author.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesCategory =
            selectedCategory === 'All' || petition.category === selectedCategory;
          return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
          if (sortBy === SORT_BY_NEWEST) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          if (sortBy === SORT_BY_OLDEST) {
            return new Date(a.createdAt) - new Date(b.createdAt);
          }
          if (sortBy === SORT_BY_MOST_VOTES) {
            return b.votes - a.votes;
          }
          return 0;
        }),
    [petitions, searchQuery, selectedCategory, sortBy],
  );

  return (
    <main className="content">
      <h1>Petycje</h1>
      {isLoading && <p>Ladowanie...</p>}
      {error && <p>{error}</p>}
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
            {PETITION_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value={SORT_BY_NEWEST}>Najnowsze</option>
            <option value={SORT_BY_OLDEST}>Najstarsze</option>
            <option value={SORT_BY_MOST_VOTES}>Najwięcej głosów</option>
          </select>
        </div>
      </div>
      {!isLoading && !error && <PetitionList petitions={filteredPetitions} />}
    </main>
  );
}

function PetitionList({ petitions }) {
  return (
    <div className="petition-grid">
      {petitions.map((petition) => (
        <PetitionCard key={petition.id} petition={petition} />
      ))}
    </div>
  );
}

export default HomePage;
