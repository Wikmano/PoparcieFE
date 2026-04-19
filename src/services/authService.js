import axios from 'axios';
import { BASE_API_URL } from '../AppConfig.js';
import {InfrastructureConstants} from "../infrastructure/Constants.js";

const api = axios.create({
  baseURL: BASE_API_URL,
});

export const authService = {
  register: async (userData) => {
    const response = await api.post('user/register', userData);

    const token = response.headers[InfrastructureConstants.AuthorizationHeader] || response.headers[InfrastructureConstants.BearerHeader];
    if (token) {
      localStorage.setItem(InfrastructureConstants.Token, token);
    }

    if (response.data && response.data.status === 'success') {
      localStorage.setItem(InfrastructureConstants.Username, userData.username);
    }

    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post('user/login', credentials);

    const token = response.headers[InfrastructureConstants.AuthorizationHeader] || response.headers[InfrastructureConstants.BearerHeader];
    if (token) {
      localStorage.setItem(InfrastructureConstants.Token, token);
    }

    if (response.data && response.data.status === 'success') {
      localStorage.setItem(InfrastructureConstants.Username, credentials.username);
    }

    return response.data;
  },
  logout: () => {
    localStorage.removeItem(InfrastructureConstants.Token);
    localStorage.removeItem(InfrastructureConstants.Username);
  },
};
