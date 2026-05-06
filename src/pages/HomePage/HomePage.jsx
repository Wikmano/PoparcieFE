import React, { useCallback, useEffect, useRef, useState } from 'react';
import PetitionCard from '../../components/PetitionCard/PetitionCard.jsx';
import Pagination from '../../components/Pagination/Pagination.jsx';
import { petitionsService } from '../../services/petitionsService.js';
import { authService } from '../../services/authService.js';
import { PETITION_CATEGORIES } from '../../constants/categories.js';

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

  const currentLabel = options.find((opt) => opt.value === value)?.label || placeholder;

  return (
    <div className={`custom-dropdown ${className}`} ref={dropdownRef}>
      <button type="button" className="dropdown-trigger" onClick={() => setIsOpen(!isOpen)}>
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
    ...PETITION_CATEGORIES.map((category) => ({ value: category, label: category })),
  ];

  const sortOptions = [
    { value: SORT_BY_CREATED_AT, label: 'Data utworzenia' },
    { value: SORT_BY_TITLE, label: 'Tytuł' },
    { value: SORT_BY_VOTES, label: 'Głosy' },
    { value: SORT_BY_DEADLINE, label: 'Termin' },
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('active');
  const [sortBy, setSortBy] = useState(SORT_BY_CREATED_AT);
  const [sortOrder, setSortOrder] = useState(SORT_ORDER_ASC);
  const [petitions, setPetitions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const isMountedRef = useRef(true);
  const isAdmin = authService.isAdmin();

  const statusOptions = [
    { value: 'active', label: 'Aktywne' },
    { value: 'closed', label: 'Zamknięte' },
    ...(isAdmin ? [{ value: 'archived', label: 'Zarchiwizowane' }] : []),
  ];

  const fetchPetitions = useCallback(async (overrides = {}) => {
    try {
      if (!isMountedRef.current) {
        return;
      }
      setError('');
      setIsLoading(true);

      const query = {
        title: overrides.title !== undefined ? overrides.title : searchQuery,
        category: overrides.category !== undefined ? overrides.category : selectedCategory,
        status: overrides.status !== undefined ? overrides.status : selectedStatus,
        sortBy: overrides.sortBy !== undefined ? overrides.sortBy : sortBy,
        sortOrder: overrides.sortOrder !== undefined ? overrides.sortOrder : sortOrder,
        page: overrides.page !== undefined ? overrides.page : 1,
        perPage: 20,
      };

      const data = await petitionsService.getAllPetitions(query);
      if (!isMountedRef.current) {
        return;
      }

      // Backend returns { data: { petitions, totalPages, totalCount } } or direct { petitions, totalPages }
      const fetchedPetitions = data?.data?.petitions || data?.petitions || [];
      let fetchedTotalPages = data?.data?.totalPages || data?.totalPages || 0;

      // Fallback: if backend doesn't provide totalPages, but we have 20 items, assume there might be a next page
      if (!fetchedTotalPages && fetchedPetitions.length === 20) {
        fetchedTotalPages = query.page + 1;
      } else if (!fetchedTotalPages) {
        fetchedTotalPages = query.page;
      }

      setPetitions(fetchedPetitions);
      setTotalPages(fetchedTotalPages);
      setCurrentPage(query.page);
    } catch {
      if (!isMountedRef.current) {
        return;
      }
      setError('Nie udało się pobrać petycji');
      setPetitions([]);
      setTotalPages(1);
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [searchQuery, selectedCategory, selectedStatus, sortBy, sortOrder]);

  useEffect(() => {
    isMountedRef.current = true;
    fetchPetitions({ page: 1 });
    return () => {
      isMountedRef.current = false;
    };
  }, []); // Run once on mount

  const handleSearchClick = async () => {
    await fetchPetitions({ page: 1 });
  };

  const handleCategoryChange = async (category) => {
    setSelectedCategory(category);
    await fetchPetitions({ category, page: 1 });
  };

  const handleStatusChange = async (status) => {
    setSelectedStatus(status);
    await fetchPetitions({ status, page: 1 });
  };

  const handleSortChange = async (newSortBy) => {
    setSortBy(newSortBy);
    await fetchPetitions({ sortBy: newSortBy, page: 1 });
  };

  const handleToggleSortOrder = async () => {
    const nextOrder = sortOrder === SORT_ORDER_DESC ? SORT_ORDER_ASC : SORT_ORDER_DESC;
    setSortOrder(nextOrder);
    await fetchPetitions({ sortOrder: nextOrder, page: 1 });
  };

  const handlePageChange = async (page) => {
    if (page === currentPage) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    await fetchPetitions({ page });
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
            options={statusOptions}
            value={selectedStatus}
            onChange={handleStatusChange}
            placeholder="Wybierz status"
            className="filter-dropdown"
          />
          <CustomDropdown
            options={sortOptions}
            value={sortBy}
            onChange={handleSortChange}
            placeholder="Sortuj według"
            className="filter-dropdown"
          />
          <button type="button" className="sort-button" onClick={handleToggleSortOrder}>
            {sortOrder === SORT_ORDER_DESC ? 'Rosnąco' : 'Malejąco'}
          </button>
        </div>
      </div>
      {!isLoading && !error && (
        <>
          <PetitionList petitions={petitions} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </main>
  );
}

function PetitionList({ petitions }) {
  return (
    <div className="petition-grid">
      {petitions.map((petition) => (
        <PetitionCard key={petition._id || petition.id} petition={petition} />
      ))}
    </div>
  );
}

export default HomePage;
