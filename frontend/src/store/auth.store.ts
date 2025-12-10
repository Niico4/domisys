import { create } from 'zustand';
import type { User } from '@/types/user';

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
};

type AuthActions = {
  setUser: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
};

export const useAuthStore = create<AuthState & AuthActions>()((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
      loading: false,
    }),

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
      loading: false,
    }),

  setLoading: (loading) =>
    set({
      loading: loading,
    }),
}));
