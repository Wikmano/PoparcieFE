import axios from 'axios';
import { BASE_API_URL } from '../AppConfig.js';

const api = axios.create({
  baseURL: BASE_API_URL + 'vote/',
  adapter: 'fetch',
  fetchOptions: {
    credentials: 'omit',
  },
});

export const voteService = {
  getGroup: async (groupId) => {
    const response = await api.get('group/' + groupId);
    return response.data;
  },
};
