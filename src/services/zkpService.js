import axios from 'axios';
import { BASE_API_URL } from '../AppConfig.js';

const zkpApi = axios.create({
  baseURL: BASE_API_URL + 'zkp/',
  withCredentials: true,
});

export const zkpService = {
  getPath: async (commitment) => {
    const response = await zkpApi.get('getpath', { params: { commitment } });
    return response.data;
  },
  sign: async (proofData) => {
    const response = await zkpApi.post('sign', proofData);
    return response.data;
  },
};
