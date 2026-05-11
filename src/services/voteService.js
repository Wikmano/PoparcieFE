import axios from 'axios';
import { BASE_API_URL } from '../AppConfig.js';

const api = axios.create({
  baseURL: BASE_API_URL + 'vote/',
  withCredentials: true,
});

export const voteService = {
  getPath: async (commitment) => {
    const response = await api.get('path/' + commitment);
    return response.data;
  },
};
