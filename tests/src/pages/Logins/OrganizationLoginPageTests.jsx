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

import OrganizationLoginPage from '../../../../src/pages/Logins/OrganizationLoginPage.jsx';

describe('OrganizationLoginPage', () => {
  it('should render the organization login form title', () => {
    render(
      <MemoryRouter>
        <OrganizationLoginPage />
      </MemoryRouter>,
    );
    expect(screen.getByText('Zaloguj się do organizacji')).toBeInTheDocument();
  });

  it('should render the organization name input field', () => {
    render(
      <MemoryRouter>
        <OrganizationLoginPage />
      </MemoryRouter>,
    );
    expect(screen.getByPlaceholderText('Nazwa organizacji')).toBeInTheDocument();
  });

  it('should render the password input field', () => {
    render(
      <MemoryRouter>
        <OrganizationLoginPage />
      </MemoryRouter>,
    );
    expect(screen.getByPlaceholderText('Hasło')).toBeInTheDocument();
  });

  it('should render the submit button', () => {
    render(
      <MemoryRouter>
        <OrganizationLoginPage />
      </MemoryRouter>,
    );
    expect(screen.getByRole('button', { name: 'Zaloguj się' })).toBeInTheDocument();
  });
});
