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

import UnifiedRegisterPage from '../../../../src/pages/Register/UnifiedRegisterPage.jsx';

describe('UnifiedRegisterPage', () => {
  it('should render the "Użytkownik" tab', () => {
    render(
      <MemoryRouter>
        <UnifiedRegisterPage />
      </MemoryRouter>,
    );
    expect(screen.getByRole('button', { name: 'Użytkownik' })).toBeInTheDocument();
  });

  it('should render the "Organizacja" tab', () => {
    render(
      <MemoryRouter>
        <UnifiedRegisterPage />
      </MemoryRouter>,
    );
    expect(screen.getByRole('button', { name: 'Organizacja' })).toBeInTheDocument();
  });

  it('should show user register form by default', () => {
    render(
      <MemoryRouter>
        <UnifiedRegisterPage />
      </MemoryRouter>,
    );
    expect(screen.getByText('Zarejestruj się')).toBeInTheDocument();
  });
});
