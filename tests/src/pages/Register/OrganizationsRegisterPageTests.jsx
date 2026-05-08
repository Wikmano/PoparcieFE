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

import OrganizationsRegisterPage from '../../../../src/pages/Register/OrganizationsRegisterPage.jsx';

describe('OrganizationsRegisterPage', () => {
  it('should render the organization registration form title', () => {
    render(
      <MemoryRouter>
        <OrganizationsRegisterPage />
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { name: 'Zarejestruj organizację' })).toBeInTheDocument();
  });

  it('should render the organization name input field', () => {
    render(
      <MemoryRouter>
        <OrganizationsRegisterPage />
      </MemoryRouter>,
    );
    expect(screen.getByPlaceholderText('Nazwa organizacji')).toBeInTheDocument();
  });

  it('should render the password input field', () => {
    render(
      <MemoryRouter>
        <OrganizationsRegisterPage />
      </MemoryRouter>,
    );
    expect(screen.getByPlaceholderText('Hasło')).toBeInTheDocument();
  });

  it('should render the submit button with correct label', () => {
    render(
      <MemoryRouter>
        <OrganizationsRegisterPage />
      </MemoryRouter>,
    );
    expect(screen.getByRole('button', { name: 'Zarejestruj organizację' })).toBeInTheDocument();
  });
});
