import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../../../src/services/petitionsService.js', () => ({
  petitionsService: {
    archivePetition: vi.fn().mockResolvedValue(undefined),
  },
}));

import PetitionCard from '../../../../src/components/PetitionCard/PetitionCard.jsx';

const basePetition = {
  _id: '1',
  title: 'Petycja testowa',
  shortDescription: 'Krótki opis petycji',
  authorDisplayName: 'Jan Kowalski',
  votes: 150,
  goal: 500,
  status: 'active',
  deadline: '2030-12-31',
  views: 42,
};

function renderCard(props = {}) {
  return render(
    <MemoryRouter>
      <PetitionCard petition={basePetition} {...props} />
    </MemoryRouter>,
  );
}

describe('PetitionCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the petition title', () => {
    renderCard();
    expect(screen.getByText('Petycja testowa')).toBeInTheDocument();
  });

  it('should render the author name in default variant', () => {
    renderCard();
    expect(screen.getByText('Jan Kowalski')).toBeInTheDocument();
  });

  it('should hide author when hideAuthor prop is true', () => {
    renderCard({ hideAuthor: true });
    expect(screen.queryByText('Jan Kowalski')).toBeNull();
  });

  it('should render the short description in default variant', () => {
    renderCard();
    expect(screen.getByText('Krótki opis petycji')).toBeInTheDocument();
  });

  it('should render vote count and goal', () => {
    renderCard();
    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText(/500/)).toBeInTheDocument();
  });

  it('should render as a link pointing to the petition detail page', () => {
    renderCard();
    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/petition/1');
  });

  it('should show status badge in dashboard variant', () => {
    renderCard({ variant: 'dashboard' });
    expect(screen.getByText('Aktywna')).toBeInTheDocument();
  });

  it('should show archive button in dashboard variant for active petition', () => {
    renderCard({ variant: 'dashboard' });
    expect(screen.getByRole('button', { name: 'Zaarchiwizuj' })).toBeInTheDocument();
  });

  it('should show archive confirmation after clicking archive button', () => {
    renderCard({ variant: 'dashboard' });
    fireEvent.click(screen.getByRole('button', { name: 'Zaarchiwizuj' }));
    expect(screen.getByText('Czy na pewno?')).toBeInTheDocument();
  });

  it('should cancel archive confirmation when "Nie" is clicked', () => {
    renderCard({ variant: 'dashboard' });
    fireEvent.click(screen.getByRole('button', { name: 'Zaarchiwizuj' }));
    fireEvent.click(screen.getByRole('button', { name: 'Nie' }));
    expect(screen.queryByText('Czy na pewno?')).toBeNull();
  });

  it('should call archivePetition when "Tak" is confirmed', async () => {
    const { petitionsService } = await import('../../../../src/services/petitionsService.js');
    renderCard({ variant: 'dashboard' });
    fireEvent.click(screen.getByRole('button', { name: 'Zaarchiwizuj' }));
    fireEvent.click(screen.getByRole('button', { name: 'Tak' }));
    await waitFor(() => {
      expect(petitionsService.archivePetition).toHaveBeenCalledWith('1');
    });
  });

  it('should display "Zamknięta" for closed petition in dashboard variant', () => {
    const closedPetition = { ...basePetition, status: 'closed' };
    render(
      <MemoryRouter>
        <PetitionCard petition={closedPetition} variant="dashboard" />
      </MemoryRouter>,
    );
    expect(screen.getByText('Zamknięta')).toBeInTheDocument();
  });

  it('should display "Zarchiwizowana" for archived petition in dashboard variant', () => {
    const archivedPetition = { ...basePetition, status: 'archived' };
    render(
      <MemoryRouter>
        <PetitionCard petition={archivedPetition} variant="dashboard" />
      </MemoryRouter>,
    );
    expect(screen.getByText('Zarchiwizowana')).toBeInTheDocument();
  });
});
