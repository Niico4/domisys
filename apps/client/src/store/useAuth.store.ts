import axios from 'axios';
import { create } from 'zustand';
import { toast } from 'sonner';

import instance from '@/utils/axios';
import { mockUsers } from '@/constants/mock/mock-users';

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  isDelivery: boolean;
};

type AuthStore = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  signUp: (newUser: Omit<User, 'id'>) => Promise<boolean>;
};

export const useAuthStore = create<AuthStore>()((set, get) => ({
  user: null,
  token: null,
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });

    try {
      const response = await instance.post<{
        accessToken: string;
        userData: User;
      }>('/auth/sign-in', {
        email,
        password,
      });

      const { accessToken, userData } = response.data;

      set({
        user: userData,
        token: accessToken,
        isLoading: false,
      });

      localStorage.setItem('token', accessToken);

      toast.success('¡Bienvenido de nuevo!');
      return true;
    } catch (error) {
      console.error(error);
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : 'Error al iniciar sesión';

      toast.error(errorMessage);

      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  signUp: async (newUser) => {
    set({ isLoading: true });

    try {
      const emailAlreadyExists = mockUsers.some(
        (user) => user.email === newUser.email,
      );

      if (emailAlreadyExists) {
        toast.warning('El email ya está registrado');
        return false;
      }

      const userWithId = {
        ...newUser,
        id: crypto.randomUUID(),
      };

      set({ user: userWithId });
      toast.success('Cuenta creada exitosamente!');
      return true;
    } catch (error) {
      console.error(error);
      toast.error(`Error al crear la cuenta`);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('token');

    set({ user: null, token: null });
    toast.info('Sesión cerrada');
  },

  updateUser: async (data) => {
    const { user, token } = get();

    if (!user || !token) {
      toast.error('No hay usuario activo');
      return false;
    }

    try {
      const response = await instance.put('/user', data);

      const updatedUser = response.data;

      set({ user: updatedUser });

      toast.success('Perfil actualizado correctamente');
      return true;
    } catch (error) {
      console.error(error);
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : 'Error al actualizar el perfil';

      toast.error(errorMessage);
      return false;
    }
  },
}));
