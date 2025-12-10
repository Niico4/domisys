import axios from 'axios';
import { NEXT_PUBLIC_API_BASE_URL } from '@/config/env.config';

const axiosInstance = axios.create({
  baseURL: NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default axiosInstance;
