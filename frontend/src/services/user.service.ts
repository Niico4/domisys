import axiosInstance from '@/lib/axios';
import { ApiResponse } from '@/types/response-data';
import { User } from '@/types/user';

export const userService = {
  getAllAdmins: async (): Promise<User[]> => {
    const response = await axiosInstance.get<ApiResponse<User[]>>(
      '/users/admins'
    );
    return response.data.data;
  },

  getAllDeliveries: async (): Promise<User[]> => {
    const response = await axiosInstance.get<ApiResponse<User[]>>(
      '/users/deliveries'
    );
    return response.data.data;
  },
};
