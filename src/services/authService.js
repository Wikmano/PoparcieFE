import axios from 'axios';
import { BASE_API_URL } from '../AppConfig.js';
import { ROLE, USERNAME } from '../constants/localStorageKeys.js';
import { ADMIN_ROLE, NORMAL_USER_ROLE, ORGANIZATION_ROLE } from '../constants/roles.js';

const api = axios.create({
  baseURL: BASE_API_URL + 'petition/user/',
  withCredentials: true,
});

export const authService = {
  register: async (userData) => {
    const response = await api.post('register', userData);
    if (response.status === 201) {
      console.log('Registration successful:', response.data);
      localStorage.setItem(USERNAME, userData.username);
      localStorage.setItem(ROLE, 'petition_user'); // hardcoded role.

      return response.data;
    } else {
      throw new Error('Registration failed');
    }
  },
  login: async (credentials) => {
    const response = await api.post('login', credentials);

    if (response.status === 200) {
      localStorage.setItem(USERNAME, credentials.username);
      localStorage.setItem(ROLE, 'petition_user'); //hardcoded role

      return response.data;
    } else {
      throw new Error('Login failed');
    }
  },
  logout: () => {
    localStorage.removeItem(ROLE);
    localStorage.removeItem(USERNAME);
  },
  isAdmin: () => {
    return localStorage.getItem(ROLE) === ADMIN_ROLE;
  },
  isOrganization: () => {
    return localStorage.getItem(ROLE) === ORGANIZATION_ROLE;
  },
  isNormalUser: () => {
    return localStorage.getItem(ROLE) === NORMAL_USER_ROLE;
  },
  getUserName: () => {
    return localStorage.getItem(USERNAME);
  },
};
