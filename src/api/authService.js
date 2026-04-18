import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/petition',
});

export const authService = {
  register: async (userData) => {
    const response = await api.post('/user/register', userData);

    const token = response.headers['authorization'] || response.headers['bearer'];
    if (token) {
      localStorage.setItem('token', token);
    }

    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post('/user/login', credentials);

    const token = response.headers['authorization'] || response.headers['bearer'];
    if (token) {
      localStorage.setItem('token', token);
    }

    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
  },
};
