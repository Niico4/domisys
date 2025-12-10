'use client';

import { useEffect } from 'react';
import axiosInstance from '@/lib/axios';
import { useAuth } from '@/hooks/useAuth';

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { setLoading, setUser } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get('/users/current-user');
        const userData = res.data.data;

        setUser(userData);

        if (userData && userData.role) {
          document.cookie = `user_role=${userData.role}; path=/; max-age=2592000; SameSite=Lax`;
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setUser(null);
        setLoading(false);
      }
    };

    // ejecutar al montar el componente
    fetchUser();

    // login/register manualmente
    const handleAuthChange = () => {
      fetchUser();
    };

    window.addEventListener('auth:refresh', handleAuthChange);

    return () => {
      window.removeEventListener('auth:refresh', handleAuthChange);
    };
  }, [setLoading, setUser]);

  return <>{children}</>;
}
