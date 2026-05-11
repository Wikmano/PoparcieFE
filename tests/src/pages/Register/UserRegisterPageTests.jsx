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
    expect(screen.getByRole('heading', { name: 'Rejestracja użytkownika' })).toBeInTheDocument();
  });

  it('should render the mObywatel registration button', () => {
    render(
      <MemoryRouter>
        <UserRegisterPage />
      </MemoryRouter>,
    );
    expect(screen.getByRole('button', { name: 'Zarejestruj z mObywatel' })).toBeInTheDocument();
  });
});
