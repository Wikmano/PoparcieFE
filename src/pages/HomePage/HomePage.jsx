import React, { useCallback, useEffect, useRef, useState } from 'react';
import PetitionCard from '../../components/PetitionCard/PetitionCard.jsx';
import { petitionsService } from '../../services/petitionsService.js';
import { PETITION_CATEGORIES } from '../../infrastructure/categories.js';

function CustomDropdown({ options, value, onChange, placeholder, className }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const currentLabel = options.find(opt => opt.value === value)?.label || placeholder;

  return (
    <div className={`custom-dropdown ${className}`} ref={dropdownRef}>
      <button
        type="button"
        className="dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{currentLabel}</span>
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>
      <div className={`dropdown-menu ${isOpen ? 'open' : ''}`}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`dropdown-option ${value === option.value ? 'selected' : ''}`}
            onClick={() => handleSelect(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function HomePage() {
  const SORT_BY_CREATED_AT = 'createdAt';
  const SORT_BY_TITLE = 'a';
  const SORT_BY_VOTES = 'v';
  const SORT_BY_DEADLINE = 'd';
  const SORT_ORDER_ASC = 'asc';
  const SORT_ORDER_DESC = 'desc';

  const categoryOptions = [
    { value: 'All', label: 'Wszystkie kategorie' },
    ...PETITION_CATEGORIES.map(category => ({ value: category, label: category }))
  ];

  const sortOptions = [
    { value: SORT_BY_CREATED_AT, label: 'Data utworzenia' },
    { value: SORT_BY_TITLE, label: 'Tytuł' },
    { value: SORT_BY_VOTES, label: 'Głosy' },
    { value: SORT_BY_DEADLINE, label: 'Termin' }
  ];

function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState(SORT_BY_CREATED_AT);
  const [sortOrder, setSortOrder] = useState(SORT_ORDER_DESC);
  const [petitions, setPetitions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const isMountedRef = useRef(true);

  const fetchPetitions = useCallback(async (options = {}) => {
    try {
      if (!isMountedRef.current) {
        return;
      }
      setError('');
      setIsLoading(true);
      const query = {
        title: options.title ?? '',
        category: options.category ?? 'All',
        sortBy: options.sortBy ?? SORT_BY_CREATED_AT,
        sortOrder: options.sortOrder ?? SORT_ORDER_DESC,
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
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    fetchPetitions({
      title: '',
      category: 'All',
      sortBy: SORT_BY_CREATED_AT,
      sortOrder: SORT_ORDER_DESC,
    });

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchPetitions]);

  const handleSearchClick = async () => {
    await fetchPetitions({
      title: searchQuery,
      category: selectedCategory,
      sortBy,
      sortOrder,
    });
    setSearchQuery('');
  };

  const handleCategoryChange = async (category) => {
    setSelectedCategory(category);
    await fetchPetitions({
      title: searchQuery,
      category,
      sortBy,
      sortOrder,
    });
  };

  const handleToggleSortOrder = async () => {
    const nextOrder = sortOrder === SORT_ORDER_DESC ? SORT_ORDER_ASC : SORT_ORDER_DESC;
    setSortOrder(nextOrder);
    await fetchPetitions({
      title: searchQuery,
      category: selectedCategory,
      sortBy,
      sortOrder: nextOrder,
    });
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
          <CustomDropdown
            options={categoryOptions}
            value={selectedCategory}
            onChange={handleCategoryChange}
            placeholder="Wybierz kategorię"
            className="filter-dropdown"
          />
          <CustomDropdown
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
            placeholder="Sortuj według"
            className="filter-dropdown"
          />
          <button type="button" className="filter-button" onClick={handleToggleSortOrder}>
            {sortOrder === SORT_ORDER_DESC ? 'Rosnąco' : 'Malejąco'}
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
