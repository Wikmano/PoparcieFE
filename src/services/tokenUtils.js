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
