import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../../../src/services/petitionsService.js', () => ({
  petitionsService: {
    getPetitionById: vi.fn(),
    signPetition: vi.fn(),
    archivePetition: vi.fn(),
  },
}));

vi.mock('../../../../src/services/authService.js', () => ({
  authService: {
    isAdmin: vi.fn().mockReturnValue(false),
    isOrganization: vi.fn().mockReturnValue(false),
  },
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useParams: () => ({ id: '42' }) };
});

import { petitionsService } from '../../../../src/services/petitionsService.js';
import { authService } from '../../../../src/services/authService.js';
import PetitionDetailsPage from '../../../../src/pages/PetitionDetail/PetitionDetailsPage.jsx';

const samplePetition = {
  _id: '42',
  title: 'Petycja szczegółowa',
  longDescription: 'Szczegółowy opis petycji',
  authorDisplayName: 'Jan Kowalski',
  category: 'Edukacja',
  votes: 200,
  goal: 500,
  status: 'active',
  createdAt: '2026-01-01T00:00:00.000Z',
  deadline: '2030-12-31T00:00:00.000Z',
};

function renderPage() {
  return render(
    <MemoryRouter>
      <PetitionDetailsPage />
    </MemoryRouter>,
  );
}

describe('PetitionDetailsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authService.isAdmin.mockReturnValue(false);
  });

  it('should show loading indicator while fetching', () => {
    petitionsService.getPetitionById.mockReturnValue(new Promise(() => {}));
    renderPage();
    expect(screen.getByText('Ładowanie petycji...')).toBeInTheDocument();
  });

  it('should render the petition title after successful fetch', async () => {
    petitionsService.getPetitionById.mockResolvedValue({ data: samplePetition });
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Petycja szczegółowa')).toBeInTheDocument();
    });
  });

  it('should render the petition description', async () => {
    petitionsService.getPetitionById.mockResolvedValue({ data: samplePetition });
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Szczegółowy opis petycji')).toBeInTheDocument();
    });
  });

  it('should render the author name', async () => {
    petitionsService.getPetitionById.mockResolvedValue({ data: samplePetition });
    renderPage();
    await waitFor(() => {
      expect(screen.getByText(/Jan Kowalski/)).toBeInTheDocument();
    });
  });

  it('should show error message when fetch fails', async () => {
    petitionsService.getPetitionById.mockRejectedValue(new Error('Not found'));
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Nie udało się pobrać petycji')).toBeInTheDocument();
    });
  });

  it('should render sign button for active petition', async () => {
    petitionsService.getPetitionById.mockResolvedValue({ data: samplePetition });
    renderPage();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Podpisz petycję' })).toBeInTheDocument();
    });
  });

  it('should render disabled sign button for archived petition', async () => {
    const archived = { ...samplePetition, status: 'archived' };
    petitionsService.getPetitionById.mockResolvedValue({ data: archived });
    renderPage();
    await waitFor(() => {
      const btn = screen.getByRole('button', { name: 'Petycja zaarchiwizowana' });
      expect(btn).toBeDisabled();
    });
  });

  it('should show admin menu toggle when user is admin', async () => {
    authService.isAdmin.mockReturnValue(true);
    petitionsService.getPetitionById.mockResolvedValue({ data: samplePetition });
    renderPage();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Pokaż menu admina' })).toBeInTheDocument();
    });
  });

  it('should reveal admin actions after clicking admin toggle', async () => {
    authService.isAdmin.mockReturnValue(true);
    petitionsService.getPetitionById.mockResolvedValue({ data: samplePetition });
    renderPage();
    await waitFor(() => screen.getByRole('button', { name: 'Pokaż menu admina' }));
    fireEvent.click(screen.getByRole('button', { name: 'Pokaż menu admina' }));
    expect(screen.getByRole('button', { name: 'Ukryj' })).toBeInTheDocument();
  });
});
