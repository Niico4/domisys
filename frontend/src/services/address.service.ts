import axiosInstance from '@/lib/axios';
import { handleApiError } from '@/utils/error-handler';
import { Address, CreateAddressPayload, UpdateAddressPayload } from '@/types/address';
import { ApiResponse } from '@/types/response-data';

export const addressService = {
  getUserAddresses: async (): Promise<Address[] | null> => {
    try {
      const res = await axiosInstance.get<ApiResponse<Address[]>>('/addresses');
      return res.data.data;
    } catch (error) {
      handleApiError(error);
      return null;
    }
  },

  getAddressById: async (id: number): Promise<Address | null> => {
    try {
      const res = await axiosInstance.get<ApiResponse<Address>>(
        `/addresses/${id}`
      );
      return res.data.data;
    } catch (error) {
      handleApiError(error);
      return null;
    }
  },

  createAddress: async (
    payload: CreateAddressPayload
  ): Promise<Address | null> => {
    try {
      const res = await axiosInstance.post<ApiResponse<Address>>(
        '/addresses',
        payload
      );
      return res.data.data;
    } catch (error) {
      handleApiError(error);
      return null;
    }
  },

  updateAddress: async (
    id: number,
    payload: UpdateAddressPayload
  ): Promise<Address | null> => {
    try {
      const res = await axiosInstance.put<ApiResponse<Address>>(
        `/addresses/${id}`,
        payload
      );
      return res.data.data;
    } catch (error) {
      handleApiError(error);
      return null;
    }
  },

  deleteAddress: async (id: number): Promise<boolean> => {
    try {
      await axiosInstance.delete(`/addresses/${id}`);
      return true;
    } catch (error) {
      handleApiError(error);
      return false;
    }
  },
};
