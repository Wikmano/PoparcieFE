import { InfrastructureConstants } from '../infrastructure/Constants.js';

export function decodeToken(token) {
  if (!token) return null;

  try {
    // Usuń 'Bearer ' jeśli istnieje
    const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;
    const parts = cleanToken.split('.');
    if (parts.length !== 3) return null;

    // Dekodowanie Base64 z obsługą Unicode
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(payload));
    console.log('Decoded token payload:', decoded);
    return decoded;
  } catch (err) {
    console.error('Error decoding token:', err);
    return null;
  }
}

export function getUserRoleFromToken() {
  const token = localStorage.getItem(InfrastructureConstants.Token);
  const decoded = decodeToken(token);
  // Sprawdź różne możliwe klucze roli (role, roles, type, authority)
  return decoded?.role || decoded?.roles || decoded?.type || decoded?.authority || null;
}

export function isOrganizationUser() {
  const roleData = getUserRoleFromToken();
  const targetRole = 'petition_user';

  if (!roleData) return false;

  // Jeśli rola jest tablicą, sprawdź czy zawiera docelową rolę
  if (Array.isArray(roleData)) {
    return roleData.some(r => 
      typeof r === 'string' && (r.toLowerCase() === targetRole || r.toLowerCase() === `role_${targetRole}`)
    );
  }

  // Jeśli rola jest stringiem
  if (typeof roleData === 'string') {
    const roleLower = roleData.toLowerCase();
    return roleLower === targetRole || roleLower === `role_${targetRole}`;
  }

  return false;
}