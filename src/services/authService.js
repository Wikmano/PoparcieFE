import axios from 'axios';
import { BASE_API_URL } from '../AppConfig.js';

const api = axios.create({
  baseURL: BASE_API_URL + 'petition/user/',
  withCredentials: true,
});

export const authService = {
  register: async (userData) => {
    const response = await api.post('register', userData);
    if (response.status === 201) {
      localStorage.setItem('username', userData.username);
      localStorage.setItem('role', userData.role);

      return response.data;
    } else {
      throw new Error('Registration failed');
    }
  },
  login: async (credentials) => {
    const response = await api.post('login', credentials);

    if (response.status === 200) {
      localStorage.setItem('username', credentials.username);
      localStorage.setItem('role', 'petition_user'); //hardcoded rola - zmienic przy implementacji zkp

      return response.data;
    } else {
      throw new Error('Login failed');
    }
  },
  logout: () => {
    localStorage.removeItem('role');
    localStorage.removeItem('username');
  },
};
