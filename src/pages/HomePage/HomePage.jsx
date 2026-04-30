import React, { useEffect, useRef, useState } from 'react';
import PetitionCard from '../../components/PetitionCard/PetitionCard.jsx';
import { petitionsService } from '../../services/petitionsService.js';
import { PETITION_CATEGORIES } from '../../infrastructure/categories.js';

function HomePage() {
  const SORT_BY_CREATED_AT = 'createdAt';
  const SORT_BY_TITLE = 'a';
  const SORT_BY_VOTES = 'v';
  const SORT_BY_DEADLINE = 'd';
  const SORT_ORDER_ASC = 'asc';
  const SORT_ORDER_DESC = 'desc';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState(SORT_BY_CREATED_AT);
  const [sortOrder, setSortOrder] = useState(SORT_ORDER_DESC);
  const [petitions, setPetitions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const isMountedRef = useRef(true);

  const fetchPetitions = async (options = {}) => {
    try {
      if (!isMountedRef.current) {
        return;
      }
      setError('');
      setIsLoading(true);
      const query = {
        title: options.title ?? searchQuery,
        category: options.category ?? selectedCategory,
        sortBy: options.sortBy ?? sortBy,
        sortOrder: options.sortOrder ?? sortOrder,
        page: 1,
        perPage: 20,
      };
      const data = await petitionsService.getAllPetitions(query);
      if (!isMountedRef.current) {
        return;
      }
      const fetchedPetitions = Array.isArray(data?.data?.petitions)
        ? data.data.petitions
        : Array.isArray(data?.petitions)
        ? data.petitions
        : Array.isArray(data)
        ? data
        : [];
      setPetitions(fetchedPetitions);
    } catch {
      if (!isMountedRef.current) {
        return;
      }
      setError('Nie udało się pobrać petycji');
      setPetitions([]);
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    isMountedRef.current = true;

    fetchPetitions();

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleSearchClick = () => {
    fetchPetitions();
    setSearchQuery('');
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    fetchPetitions({ category });
  };

  const handleToggleSortOrder = () => {
    const nextOrder = sortOrder === SORT_ORDER_DESC ? SORT_ORDER_ASC : SORT_ORDER_DESC;
    setSortOrder(nextOrder);
    fetchPetitions({ sortOrder: nextOrder });
  };

  return (
    <main className="content">
      <h1>Petycje</h1>
      {isLoading && <p>Ładowanie...</p>}
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
          <button type="button" className="filter-button" onClick={handleSearchClick}>
            Szukaj
          </button>
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
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
            <option value={SORT_BY_CREATED_AT}>Data utworzenia</option>
            <option value={SORT_BY_TITLE}>Tytuł</option>
            <option value={SORT_BY_VOTES}>Głosy</option>
            <option value={SORT_BY_DEADLINE}>Termin</option>
          </select>
          <button type="button" className="filter-button" onClick={handleToggleSortOrder}>
            {sortOrder === SORT_ORDER_DESC ? 'Pokaż od góry' : 'Pokaż od dołu'}
          </button>
        </div>
      </div>
      {!isLoading && !error && <PetitionList petitions={petitions} />}
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
