'use client';
import Router from 'next/router';
import {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';

import { useAuthStore } from '@/store/auth.store';

interface QueueItem {
  resolve: (value: AxiosResponse) => void;
  reject: (error: AxiosError) => void;
  config: AxiosRequestConfigWithRetry;
}

interface AxiosRequestConfigWithRetry extends AxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;
let queue: QueueItem[] = [];

const processQueue = (
  error: AxiosError | null = null,
  token?: AxiosResponse
) => {
  queue.forEach(({ resolve, reject }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    error ? reject(error) : resolve(token!);
  });
  queue = [];
};

export function setupAxiosInterceptors(axiosInstance: AxiosInstance) {
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfigWithRetry;

      if (!originalRequest || !error.response) return Promise.reject(error);

      const status = error.response.status;

      if (status !== 401 || originalRequest._retry) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise<AxiosResponse>((resolve, reject) => {
          queue.push({ resolve, reject, config: originalRequest });
        }).then(() => axiosInstance(originalRequest));
      }

      isRefreshing = true;

      try {
        const refreshResponse = await axiosInstance.get('/auth/refresh-token');

        processQueue(null, refreshResponse);

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError);

        const authStore = useAuthStore.getState();
        authStore.logout();

        Router.push('/auth/login');
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
  );
}
