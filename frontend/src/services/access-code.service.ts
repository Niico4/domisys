import axiosInstance from '@/lib/axios';
import {
  AccessCode,
  CreateAccessCodePayload,
} from '@/types/user-management/access-code';
import { ApiResponse } from '@/types/response-data';

export const accessCodeService = {
  getAll: async () => {
    const response = await axiosInstance.get<ApiResponse<AccessCode[]>>(
      '/access-codes'
    );
    return response.data.data;
  },

  create: async (payload: CreateAccessCodePayload) => {
    const response = await axiosInstance.post<ApiResponse<AccessCode>>(
      '/access-codes',
      payload
    );
    return response.data.data;
  },

  disable: async (id: number) => {
    const response = await axiosInstance.delete<ApiResponse<AccessCode>>(
      `${'/access-codes'}/${id}`
    );
    return response.data.data;
  },
};
