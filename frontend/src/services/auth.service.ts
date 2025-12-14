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

const setCookie = (name: string, value: string, maxAge: number) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const sameSite = isProduction ? 'None; Secure' : 'Lax';
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=${sameSite}`;
};

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
        setCookie('user_role', user.role, 2592000);
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
        setCookie('user_role', user.role, 2592000);
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
      setCookie('user_role', '', 0);
      window.location.href = '/auth/login';
    }
  },
};
