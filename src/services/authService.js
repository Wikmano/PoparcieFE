import axios from 'axios';
import { BASE_API_URL } from '../AppConfig.js';
import { InfrastructureConstants } from '../infrastructure/Constants.js';

const api = axios.create({
  baseURL: BASE_API_URL + 'petition/user/',
});

const decodeBase64Url = (value) => {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  return atob(padded);
};

const parseJwtPayload = (token) => {
  if (!token) {
    return null;
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return null;
  }

  try {
    const payloadJson = decodeBase64Url(parts[1]);
    return JSON.parse(payloadJson);
  } catch (error) {
    console.error('Invalid JWT payload:', error);
    return null;
  }
};

const isOrganizationValue = (value) => {
  if (value === true) 
    {
    return true;
  }

  const normalized = String(value).toLowerCase();
  return normalized === 'petition_user' || normalized === 'organization' || normalized === 'org' || normalized === 'organizationuser';
};

export const authService = {
  register: async (userData) => {
    console.log('Registering user with data:', userData, BASE_API_URL);
    const response = await api.post('register', userData).then((response) => {
      console.log(response);
      return response;
    });

    const token =
      response.headers[InfrastructureConstants.AuthorizationHeader] ||
      response.headers[InfrastructureConstants.BearerHeader];
    if (token) {
      localStorage.setItem(InfrastructureConstants.Token, token);
    }

    if (response.data && response.data.status === 'success') {
      localStorage.setItem(InfrastructureConstants.Username, userData.username);
    }

    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post('login', credentials);

    const token =
      response.headers[InfrastructureConstants.AuthorizationHeader] ||
      response.headers[InfrastructureConstants.BearerHeader];
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
  getTokenPayload: () => {
    const token = localStorage.getItem(InfrastructureConstants.Token);
    return parseJwtPayload(token);
  },
  isOrganization: () => {
    const payload = authService.getTokenPayload();
    const result = payload && payload.role === "petition_user";
    console.log('isOrganization check:', { payload, result });
    return result;
  },
};
