import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../../../src/services/authService.js', () => ({
  authService: {
    login: vi.fn(),
    getUserName: vi.fn().mockReturnValue(null),
    isOrganization: vi.fn().mockReturnValue(false),
  },
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => vi.fn() };
});

import UserLoginPage from '../../../../src/pages/Logins/UserLoginPage.jsx';

describe('UserLoginPage', () => {
  it('should render the login form title', () => {
    render(
      <MemoryRouter>
        <UserLoginPage />
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { name: 'Zaloguj się' })).toBeInTheDocument();
  });

  it('should render the username input field', () => {
    render(
      <MemoryRouter>
        <UserLoginPage />
      </MemoryRouter>,
    );
    expect(screen.getByPlaceholderText('Nazwa użytkownika')).toBeInTheDocument();
  });

  it('should render the password input field', () => {
    render(
      <MemoryRouter>
        <UserLoginPage />
      </MemoryRouter>,
    );
    expect(screen.getByPlaceholderText('Hasło')).toBeInTheDocument();
  });

  it('should render the submit button', () => {
    render(
      <MemoryRouter>
        <UserLoginPage />
      </MemoryRouter>,
    );
    expect(screen.getByRole('button', { name: 'Zaloguj się' })).toBeInTheDocument();
  });
});
