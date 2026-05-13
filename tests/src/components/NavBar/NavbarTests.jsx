import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ORGANIZATION_ROLE, ADMIN_ROLE } from '../../../../src/constants/roles.js';
import { ROLE } from '../../../../src/constants/localStorageKeys.js';

vi.mock('../../../../src/services/authService.js', () => ({
  authService: {
    getUserName: vi.fn(),
    isOrganization: vi.fn(),
    isNormalUser: vi.fn(),
    logout: vi.fn(),
  },
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

import { authService } from '../../../../src/services/authService.js';
import Navbar from '../../../../src/components/NavBar/Navbar.jsx';

function renderNavbar() {
  return render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>,
  );
}

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should render the brand name', () => {
    authService.getUserName.mockReturnValue(null);
    authService.isOrganization.mockReturnValue(false);
    authService.isNormalUser.mockReturnValue(false);
    renderNavbar();
    expect(screen.getByText('Poparcie')).toBeInTheDocument();
  });

  it('should show login and register links when user is not logged in', () => {
    authService.getUserName.mockReturnValue(null);
    authService.isOrganization.mockReturnValue(false);
    authService.isNormalUser.mockReturnValue(false);
    renderNavbar();
    expect(screen.getByRole('link', { name: 'Logowanie' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Rejestracja' })).toBeInTheDocument();
  });

  it('should show welcome message when user is logged in', () => {
    authService.getUserName.mockReturnValue('jankowalski');
    authService.isOrganization.mockReturnValue(false);
    authService.isNormalUser.mockReturnValue(false);
    renderNavbar();
    expect(screen.getByText(/Witaj, jankowalski/)).toBeInTheDocument();
  });

  it('should show logout button when user is logged in', () => {
    authService.getUserName.mockReturnValue('jankowalski');
    authService.isOrganization.mockReturnValue(false);
    authService.isNormalUser.mockReturnValue(false);
    renderNavbar();
    expect(screen.getByRole('button', { name: 'Wyloguj' })).toBeInTheDocument();
  });

  it('should show organization links when user has organization role', () => {
    localStorage.setItem(ROLE, ORGANIZATION_ROLE);
    authService.getUserName.mockReturnValue('org');
    authService.isOrganization.mockReturnValue(true);
    authService.isNormalUser.mockReturnValue(false);
    renderNavbar();
    expect(screen.getByRole('link', { name: /Moje petycje/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Utwórz petycję/ })).toBeInTheDocument();
  });

  it('should not show organization links for regular logged-in user', () => {
    authService.getUserName.mockReturnValue('jan');
    authService.isOrganization.mockReturnValue(false);
    authService.isNormalUser.mockReturnValue(false);
    renderNavbar();
    expect(screen.queryByRole('link', { name: /Moje petycje/ })).toBeNull();
  });

  it('should call authService.logout when logout button is clicked', () => {
    authService.getUserName.mockReturnValue('jankowalski');
    authService.isOrganization.mockReturnValue(false);
    authService.isNormalUser.mockReturnValue(false);
    renderNavbar();
    fireEvent.click(screen.getByRole('button', { name: 'Wyloguj' }));
    expect(authService.logout).toHaveBeenCalled();
  });

  it('should not show organization links for admin role', () => {
    localStorage.setItem(ROLE, ADMIN_ROLE);
    authService.getUserName.mockReturnValue('admin');
    authService.isOrganization.mockReturnValue(false);
    authService.isNormalUser.mockReturnValue(false);
    renderNavbar();
    expect(screen.queryByRole('link', { name: /Utwórz petycję/ })).toBeNull();
  });

  it('should show only logout button for normal user', () => {
    authService.getUserName.mockReturnValue(null);
    authService.isOrganization.mockReturnValue(false);
    authService.isNormalUser.mockReturnValue(true);
    renderNavbar();
    expect(screen.getByRole('button', { name: 'Wyloguj' })).toBeInTheDocument();
    expect(screen.queryByText(/Witaj/)).toBeNull();
    expect(screen.queryByRole('link', { name: /Moje petycje/ })).toBeNull();
    expect(screen.queryByRole('link', { name: /Utwórz petycję/ })).toBeNull();
  });
});
