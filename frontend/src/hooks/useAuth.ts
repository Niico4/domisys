import { useAuthStore } from '@/store/auth.store';

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.loading);
  const setLoading = useAuthStore((state) => state.setLoading);
  const logout = useAuthStore((state) => state.logout);

  return {
    user,
    isLoading,
    isAuthenticated,

    setUser,
    setLoading,
    logout,
  };
};
