'use client';

import { useEffect } from 'react';
import { setupAxiosInterceptors } from '@/lib/axios-interceptor';
import axiosInstance from '@/lib/axios';

export function AxiosProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    setupAxiosInterceptors(axiosInstance);
  }, []);

  return <>{children}</>;
}
