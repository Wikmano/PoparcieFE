import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../src/services/authService.js', () => ({
  authService: {
    getUserName: vi.fn().mockReturnValue(null),
    isOrganization: vi.fn().mockReturnValue(false),
    isAdmin: vi.fn().mockReturnValue(false),
  },
}));

vi.mock('../../src/services/petitionsService.js', () => ({
  petitionsService: {
    getAllPetitions: vi.fn().mockResolvedValue({ data: { petitions: [] } }),
  },
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => vi.fn(), useParams: () => ({ id: '1' }) };
});

import App from '../../src/App.jsx';

describe('App', () => {
  it('should render the navbar', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('should render the home page at "/" route', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { name: 'Petycje' })).toBeInTheDocument();
  });

  it('should render the login page at "/login" route', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByRole('button', { name: 'Użytkownik' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Organizacja' })).toBeInTheDocument();
  });

  it('should render the register page at "/register" route', () => {
    render(
      <MemoryRouter initialEntries={['/register']}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByRole('button', { name: 'Użytkownik' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Organizacja' })).toBeInTheDocument();
  });
});
