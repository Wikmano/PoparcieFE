import axios from 'axios';
import { BASE_API_URL } from '../AppConfig.js';
import { InfrastructureConstants } from '../infrastructure/Constants.js';

const api = axios.create({
  baseURL: BASE_API_URL + 'petition/user/',
});

const extractToken = (response) => {
  // Check body first, then headers
  if (response.data && response.data.token) return response.data.token;
  if (typeof response.data === 'string' && response.data.length > 50) return response.data; // direct string token
  return response.headers['authorization'] || response.headers['Authorization'];
};

export const authService = {
  register: async (userData) => {
    const response = await api.post('register', userData);
    const token = extractToken(response);

    if (token) {
      const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;
      localStorage.setItem(InfrastructureConstants.Token, cleanToken);
      localStorage.setItem(InfrastructureConstants.Username, userData.username);
    }

    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post('login', credentials);
    const token = extractToken(response);

    if (token) {
      const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;
      localStorage.setItem(InfrastructureConstants.Token, cleanToken);
      localStorage.setItem(InfrastructureConstants.Username, credentials.username);
      return { status: 'success', token: cleanToken };
    } else {
      throw new Error('Nieprawidłowe dane logowania lub brak tokenu');
    }
  },
  logout: () => {
    localStorage.removeItem(InfrastructureConstants.Token);
    localStorage.removeItem(InfrastructureConstants.Username);
  },
};
