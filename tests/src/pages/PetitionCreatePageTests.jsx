import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PETITION_CATEGORIES } from '../../../src/constants/categories.js';

vi.mock('../../../src/services/petitionsService.js', () => ({
  petitionsService: {
    createPetition: vi.fn(),
  },
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => vi.fn() };
});

import { petitionsService } from '../../../src/services/petitionsService.js';
import PetitionCreatePage from '../../../src/pages/PetitionCreatePage.jsx';

function renderPage() {
  return render(
    <MemoryRouter>
      <PetitionCreatePage />
    </MemoryRouter>,
  );
}

describe('PetitionCreatePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the page heading', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: 'Utwórz nową petycję' })).toBeInTheDocument();
  });

  it('should render the title input field', () => {
    renderPage();
    expect(screen.getByLabelText('Temat petycji')).toBeInTheDocument();
  });

  it('should render the short description textarea', () => {
    renderPage();
    expect(screen.getByLabelText('Krótki opis')).toBeInTheDocument();
  });

  it('should render the long description textarea', () => {
    renderPage();
    expect(screen.getByLabelText('Pełny opis petycji')).toBeInTheDocument();
  });

  it('should render the category select with all categories as options', () => {
    renderPage();
    const select = screen.getByLabelText('Kategoria');
    expect(select).toBeInTheDocument();
    PETITION_CATEGORIES.forEach((category) => {
      expect(screen.getByRole('option', { name: category })).toBeInTheDocument();
    });
  });

  it('should render the goal input field', () => {
    renderPage();
    expect(screen.getByLabelText('Cel zdobytych głosów')).toBeInTheDocument();
  });

  it('should render the deadline input field', () => {
    renderPage();
    expect(screen.getByLabelText('Deadline')).toBeInTheDocument();
  });

  it('should render the submit button', () => {
    renderPage();
    expect(screen.getByRole('button', { name: 'Utwórz petycję' })).toBeInTheDocument();
  });

  it('should render the cancel button', () => {
    renderPage();
    expect(screen.getByRole('button', { name: 'Anuluj' })).toBeInTheDocument();
  });

  it('should show validation error when form is submitted with empty title', async () => {
    petitionsService.createPetition.mockResolvedValue({});
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Utwórz petycję' }));
    await waitFor(() => {
      expect(screen.getByText(/jest wymagany/i)).toBeInTheDocument();
    });
  });

  it('should call createPetition with correct data on valid submission', async () => {
    petitionsService.createPetition.mockResolvedValue({});
    renderPage();

    fireEvent.change(screen.getByLabelText('Temat petycji'), {
      target: { value: 'Tytuł petycji testowej' },
    });
    fireEvent.change(screen.getByLabelText('Krótki opis'), {
      target: { value: 'Krótki opis petycji' },
    });
    fireEvent.change(screen.getByLabelText('Pełny opis petycji'), {
      target: { value: 'Długi opis petycji zawierający szczegóły i argumenty.' },
    });
    fireEvent.change(screen.getByLabelText('Kategoria'), {
      target: { value: PETITION_CATEGORIES[0] },
    });
    fireEvent.change(screen.getByLabelText('Cel zdobytych głosów'), {
      target: { value: '1000' },
    });
    fireEvent.change(screen.getByLabelText('Deadline'), {
      target: { value: '2030-12-31' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Utwórz petycję' }));

    await waitFor(() => {
      expect(petitionsService.createPetition).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Tytuł petycji testowej',
          category: PETITION_CATEGORIES[0],
          goal: 1000,
        }),
      );
    });
  });
});
