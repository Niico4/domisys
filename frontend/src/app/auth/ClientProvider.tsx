'use client';

import { useEffect } from 'react';
import { setupAxiosInterceptors } from '@/utils/axios-interceptor';
import axiosInstance from '@/utils/axios';

export function ClientProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    setupAxiosInterceptors(axiosInstance);
  }, []);

  return <>{children}</>;
}
