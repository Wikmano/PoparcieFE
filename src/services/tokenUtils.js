export function decodeToken(token) {
  if (!token) return null;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const decoded = JSON.parse(atob(parts[1]));
    console.log('Decoded token:', decoded);
    return decoded;
  } catch (err) {
    console.error('Error decoding token:', err);
    return null;
  }
}

export function getUserRoleFromToken() {
  const token = localStorage.getItem('token');
  const decoded = decodeToken(token);
  return decoded?.role || decoded?.type || null;
}

export function isOrganizationUser() {
  const role = getUserRoleFromToken();
  // Tymczasowo: każdy zalogowany użytkownik widzi przycisk
  return !!localStorage.getItem('token');
}