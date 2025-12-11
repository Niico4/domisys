import axiosInstance from '@/lib/axios';
import { handleApiError } from '@/utils/error-handler';
import { Provider } from '@/types/provider';
import { ApiResponse } from '@/types/response-data';
import { ProviderPayloadType } from '@/app/(protected)/admin/inventory/components/provider/provider.schema';

export const providerService = {
  getAllProviders: async (): Promise<Provider[] | null> => {
    try {
      const res = await axiosInstance.get<ApiResponse<Provider[]>>(
        '/providers'
      );
      return res.data.data;
    } catch (error) {
      handleApiError(error);
      return null;
    }
  },

  getProviderById: async (id: number): Promise<Provider | null> => {
    try {
      const res = await axiosInstance.get<ApiResponse<Provider>>(
        `/providers/${id}`
      );
      return res.data.data;
    } catch (error) {
      handleApiError(error);
      return null;
    }
  },

  createProvider: async (
    payload: ProviderPayloadType
  ): Promise<Provider | null> => {
    try {
      const res = await axiosInstance.post<ApiResponse<Provider>>(
        '/providers',
        payload
      );
      return res.data.data;
    } catch (error) {
      handleApiError(error);
      return null;
    }
  },
};
