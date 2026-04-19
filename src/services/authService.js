import axios from 'axios';
import { BASE_API_URL } from '../AppConfig.js';

const api = axios.create({
  baseURL: BASE_API_URL,
});

export const authService = {
  register: async (userData) => {
    const response = await api.post('user/register', userData);

    const token = response.headers['authorization'] || response.headers['bearer'];
    if (token) {
      localStorage.setItem('token', token);
    }

    if (response.data && response.data.status === 'success') {
      localStorage.setItem('username', userData.username);
    }

    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post('user/login', credentials);

    const token = response.headers['authorization'] || response.headers['bearer'];
    if (token) {
      localStorage.setItem('token', token);
    }

    if (response.data && response.data.status === 'success') {
      localStorage.setItem('username', credentials.username);
    }

    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  },
};
