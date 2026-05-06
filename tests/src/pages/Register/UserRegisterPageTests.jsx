import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../../../src/services/authService.js', () => ({
  authService: {
    register: vi.fn(),
    getUserName: vi.fn().mockReturnValue(null),
    isOrganization: vi.fn().mockReturnValue(false),
  },
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => vi.fn() };
});

import UserRegisterPage from '../../../../src/pages/Register/UserRegisterPage.jsx';

describe('UserRegisterPage', () => {
  it('should render the registration form title', () => {
    render(
      <MemoryRouter>
        <UserRegisterPage />
      </MemoryRouter>,
    );
    expect(screen.getByText('Zarejestruj się')).toBeInTheDocument();
  });

  it('should render the username input field', () => {
    render(
      <MemoryRouter>
        <UserRegisterPage />
      </MemoryRouter>,
    );
    expect(screen.getByPlaceholderText('Nazwa użytkownika')).toBeInTheDocument();
  });

  it('should render the password input field', () => {
    render(
      <MemoryRouter>
        <UserRegisterPage />
      </MemoryRouter>,
    );
    expect(screen.getByPlaceholderText('Hasło')).toBeInTheDocument();
  });

  it('should render the first name input field', () => {
    render(
      <MemoryRouter>
        <UserRegisterPage />
      </MemoryRouter>,
    );
    expect(screen.getByPlaceholderText('Imię')).toBeInTheDocument();
  });

  it('should render the last name input field', () => {
    render(
      <MemoryRouter>
        <UserRegisterPage />
      </MemoryRouter>,
    );
    expect(screen.getByPlaceholderText('Nazwisko')).toBeInTheDocument();
  });

  it('should render the submit button', () => {
    render(
      <MemoryRouter>
        <UserRegisterPage />
      </MemoryRouter>,
    );
    expect(screen.getByRole('button', { name: 'Zarejestruj się' })).toBeInTheDocument();
  });
});
