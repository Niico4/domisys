import { RegisterPayloadType } from '@/app/auth/register/register.schema';
import { User } from '@/types/user';
import axiosInstance from '@/utils/axios';
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

      return res.data.data;
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
      return res.data.data;
    } catch (error) {
      handleApiError(error);
      return null;
    }
  },
};
