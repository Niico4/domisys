import axios from 'axios';

const isServer = typeof window === 'undefined';
const baseURL = isServer 
  ? process.env.NEXT_PUBLIC_API_BASE_URL 
  : '/api';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default axiosInstance;
