import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../../../src/services/petitionsService.js', () => ({
  petitionsService: {
    getMyPetitions: vi.fn(),
  },
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => vi.fn() };
});

import { petitionsService } from '../../../../src/services/petitionsService.js';
import MyPetitionsPage from '../../../../src/pages/MyPetitionsPage/MyPetitionsPage.jsx';

function renderPage() {
  return render(
    <MemoryRouter>
      <MyPetitionsPage />
    </MemoryRouter>,
  );
}

describe('MyPetitionsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading indicator while fetching', () => {
    petitionsService.getMyPetitions.mockReturnValue(new Promise(() => {}));
    renderPage();
    expect(screen.getByText('Ładowanie panelu...')).toBeInTheDocument();
  });

  it('should render the organization panel heading after load', async () => {
    petitionsService.getMyPetitions.mockResolvedValue({ data: [] });
    renderPage();
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Panel Organizacji' })).toBeInTheDocument();
    });
  });

  it('should show "Brak petycji" when no petitions are returned', async () => {
    petitionsService.getMyPetitions.mockResolvedValue({ data: [] });
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Brak petycji')).toBeInTheDocument();
    });
  });

  it('should render petition cards when petitions are returned', async () => {
    const petitions = [
      {
        _id: '1',
        title: 'Moja petycja',
        shortDescription: 'Opis',
        authorDisplayName: 'Org',
        votes: 5,
        goal: 100,
        status: 'active',
        views: 10,
      },
    ];
    petitionsService.getMyPetitions.mockResolvedValue({ data: petitions });
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Moja petycja')).toBeInTheDocument();
    });
  });

  it('should show error message when fetch fails', async () => {
    petitionsService.getMyPetitions.mockRejectedValue(new Error('Fetch error'));
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Nie udało się pobrać Twoich petycji.')).toBeInTheDocument();
    });
  });

  it('should display total petition count in summary', async () => {
    const petitions = [
      {
        _id: '1',
        title: 'P1',
        shortDescription: 'Opis',
        authorDisplayName: 'Org',
        votes: 1,
        goal: 100,
        status: 'active',
        views: 0,
      },
      {
        _id: '2',
        title: 'P2',
        shortDescription: 'Opis 2',
        authorDisplayName: 'Org',
        votes: 2,
        goal: 200,
        status: 'active',
        views: 0,
      },
    ];
    petitionsService.getMyPetitions.mockResolvedValue({ data: petitions });
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });
});
