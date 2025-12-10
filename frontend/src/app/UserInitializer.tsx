'use client';

import { useEffect } from 'react';
import axiosInstance from '@/utils/axios';
import { useAuth } from '@/hooks/useAuth';

export function UserInitializer({ children }: { children: React.ReactNode }) {
  const { setLoading, setUser } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get('/users/current-user');
        setUser(res.data.data.user);
      } catch {
        setLoading(false);
      }
    };

    fetchUser();
  }, [setLoading, setUser]);

  return <>{children}</>;
}
