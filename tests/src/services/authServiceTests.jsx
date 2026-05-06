import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ADMIN_ROLE, ORGANIZATION_ROLE, NORMAL_USER_ROLE } from '../../../src/constants/roles.js';
import { USERNAME, ROLE } from '../../../src/constants/localStorageKeys.js';

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      post: vi.fn().mockResolvedValue({ status: 200, data: {} }),
      get: vi.fn().mockResolvedValue({ status: 200, data: {} }),
    })),
  },
}));

describe('authService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return null username when not logged in', async () => {
    const { authService } = await import('../../../src/services/authService.js');
    expect(authService.getUserName()).toBeNull();
  });

  it('should return false for isAdmin when no role is set', async () => {
    const { authService } = await import('../../../src/services/authService.js');
    expect(authService.isAdmin()).toBe(false);
  });

  it('should return false for isOrganization when no role is set', async () => {
    const { authService } = await import('../../../src/services/authService.js');
    expect(authService.isOrganization()).toBe(false);
  });

  it('should return false for isNormalUser when no role is set', async () => {
    const { authService } = await import('../../../src/services/authService.js');
    expect(authService.isNormalUser()).toBe(false);
  });

  it('should return true for isAdmin when role is admin', async () => {
    const { authService } = await import('../../../src/services/authService.js');
    localStorage.setItem(ROLE, ADMIN_ROLE);
    expect(authService.isAdmin()).toBe(true);
  });

  it('should return true for isOrganization when role is petition_user', async () => {
    const { authService } = await import('../../../src/services/authService.js');
    localStorage.setItem(ROLE, ORGANIZATION_ROLE);
    expect(authService.isOrganization()).toBe(true);
  });

  it('should return true for isNormalUser when role is user', async () => {
    const { authService } = await import('../../../src/services/authService.js');
    localStorage.setItem(ROLE, NORMAL_USER_ROLE);
    expect(authService.isNormalUser()).toBe(true);
  });

  it('should return stored username', async () => {
    const { authService } = await import('../../../src/services/authService.js');
    localStorage.setItem(USERNAME, 'jankowalski');
    expect(authService.getUserName()).toBe('jankowalski');
  });

  it('logout should clear username and role from localStorage', async () => {
    const { authService } = await import('../../../src/services/authService.js');
    localStorage.setItem(USERNAME, 'jankowalski');
    localStorage.setItem(ROLE, ORGANIZATION_ROLE);
    authService.logout();
    expect(authService.getUserName()).toBeNull();
    expect(authService.isOrganization()).toBe(false);
  });
});
