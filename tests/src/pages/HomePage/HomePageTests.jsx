import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../../../src/services/petitionsService.js', () => ({
  petitionsService: {
    getAllPetitions: vi.fn(),
  },
}));

vi.mock('../../../../src/services/authService.js', () => ({
  authService: {
    isAdmin: vi.fn().mockReturnValue(false),
  },
}));

import { petitionsService } from '../../../../src/services/petitionsService.js';
import HomePage from '../../../../src/pages/HomePage/HomePage.jsx';

function renderHomePage() {
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  );
}

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading indicator while fetching', () => {
    petitionsService.getAllPetitions.mockReturnValue(new Promise(() => {}));
    renderHomePage();
    expect(screen.getByText('Ładowanie...')).toBeInTheDocument();
  });

  it('should render the page heading', async () => {
    petitionsService.getAllPetitions.mockResolvedValue({ data: { petitions: [] } });
    renderHomePage();
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Petycje' })).toBeInTheDocument();
    });
  });

  it('should render petition cards after successful fetch', async () => {
    const petitions = [
      {
        _id: '1',
        title: 'Petycja numer jeden',
        shortDescription: 'Opis',
        authorDisplayName: 'Jan',
        votes: 10,
        goal: 100,
        status: 'active',
      },
    ];
    petitionsService.getAllPetitions.mockResolvedValue({ data: { petitions } });
    renderHomePage();
    await waitFor(() => {
      expect(screen.getByText('Petycja numer jeden')).toBeInTheDocument();
    });
  });

  it('should show error message when fetch fails', async () => {
    petitionsService.getAllPetitions.mockRejectedValue(new Error('Network error'));
    renderHomePage();
    await waitFor(() => {
      expect(screen.getByText('Nie udało się pobrać petycji')).toBeInTheDocument();
    });
  });

  it('should render search input', async () => {
    petitionsService.getAllPetitions.mockResolvedValue({ data: { petitions: [] } });
    renderHomePage();
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Szukaj petycji...')).toBeInTheDocument();
    });
  });

  it('should render search button', async () => {
    petitionsService.getAllPetitions.mockResolvedValue({ data: { petitions: [] } });
    renderHomePage();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Szukaj' })).toBeInTheDocument();
    });
  });
});
