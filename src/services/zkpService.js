import axios from 'axios';
import { BASE_API_URL } from '../AppConfig.js';

const zkpApi = axios.create({
  baseURL: BASE_API_URL + 'vote/',
  withCredentials: false,
});

export const zkpService = {
  sign: async (proofData) => {
    const response = await zkpApi.post('sign', proofData);
    return response.data;
  },
};
