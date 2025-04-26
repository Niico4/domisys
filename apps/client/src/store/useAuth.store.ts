import axios from 'axios';
import { create } from 'zustand';
import { toast } from 'sonner';

import instance from '@/utils/axios';
import { paths } from '@/constants/routerPaths';

export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
  DELIVERY = 'delivery',
}

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  invitationCode?: string;
  role: UserRole | null;
};

type AuthState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
};

type AuthActions = {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (newUser: SignUpPayload) => Promise<boolean>;
  updateUser: (user: Partial<User>) => void;
  logout: () => void;
  clearError: () => void;
};

export type SignUpPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  password: string;
  confirmPassword?: string;
  invitationCode?: string;
};

export const useAuthStore = create<AuthState & AuthActions>()((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  signIn: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      const { data } = await instance.post<{
        accessToken: string;
        userData: User;
      }>(`/${paths.authRoot}/${paths.signIn}`, {
        email,
        password,
      });

      set({
        user: data.userData,
        token: data.accessToken,
      });

      localStorage.setItem('token', data.accessToken);
      toast.success('¡Bienvenido de nuevo!');
    } catch (error) {
      console.error(error);
      const errorMessage = getErrorMessage(error);

      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  signUp: async (newUser) => {
    set({ isLoading: true, error: null });

    try {
      await instance.post(`/${paths.authRoot}/${paths.signUp}`, {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        address: newUser.address,
        // role: newUser.role,
        password: newUser.password,
        invitationCode: newUser.invitationCode,
      });

      toast.success('Cuenta creada con éxito, inicia sesión');
      return true;
    } catch (error) {
      console.error(error);
      const errorMessage = getErrorMessage(error);

      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  updateUser: async (userData) => {
    const { user, token } = get();

    if (!user || !token) {
      toast.error('No hay usuario autenticado');
      return;
    }

    try {
      const { data } = await instance.put('/user', userData);

      const updatedUser: User = {
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        address: data.address,
        invitationCode: data.invitationCode,
        role: data.role,
      };

      set({ user: updatedUser });
      toast.success('Perfil actualizado correctamente');
    } catch (error) {
      console.error(error);
      const errorMessage = getErrorMessage(error);

      set({ error: errorMessage });
      toast.error(errorMessage);
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
    toast.info('Sesión cerrada');
  },

  clearError: () => set({ error: null }),
}));

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }
  return error instanceof Error ? error.message : 'Error desconocido';
}
