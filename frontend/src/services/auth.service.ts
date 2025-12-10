import { RegisterPayloadType } from '@/app/auth/register/register.schema';
import { User } from '@/types/user';
import axiosInstance from '@/lib/axios';
import { handleApiError } from '@/utils/error-handler';

interface AxiosResponseWrapper {
  data: AuthResponseData;
}

interface AuthResponseData {
  user: User;
  message: string;
  success: boolean;
}

export const authService = {
  login: async (
    emailOrUsername: string,
    password: string
  ): Promise<AuthResponseData | null> => {
    try {
      const res = await axiosInstance.post<AxiosResponseWrapper>(
        '/auth/login',
        {
          emailOrUsername,
          password,
        }
      );

      const userData = res.data.data;
      const user = userData.user;

      if (user.role) {
        document.cookie = `user_role=${user.role}; path=/; max-age=2592000; SameSite=Lax`;
      }

      return userData;
    } catch (error) {
      handleApiError(error);
      return null;
    }
  },

  register: async (
    payload: RegisterPayloadType
  ): Promise<AuthResponseData | null> => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...payloadToSend } = payload;

      const res = await axiosInstance.post<AxiosResponseWrapper>(
        '/auth/register',
        payloadToSend
      );

      const userData = res.data.data;
      const user = userData.user;

      if (user.role) {
        document.cookie = `user_role=${user.role}; path=/; max-age=2592000; SameSite=Lax`;
      }

      return userData;
    } catch (error) {
      handleApiError(error);
      return null;
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      handleApiError(error);
    } finally {
      // Limpiar cookie de role
      document.cookie = 'user_role=; path=/; max-age=0; SameSite=Lax';
      window.location.href = '/auth/login';
    }
  },
};
