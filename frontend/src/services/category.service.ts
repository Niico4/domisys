import axiosInstance from '@/lib/axios';
import { handleApiError } from '@/utils/error-handler';
import { Category, CreateCategoryPayload } from '@/types/category';

interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export const categoryService = {
  getAllCategories: async (): Promise<Category[] | null> => {
    try {
      const res = await axiosInstance.get<ApiResponse<Category[]>>('/categories');
      return res.data.data;
    } catch (error) {
      handleApiError(error);
      return null;
    }
  },

  getCategoryById: async (id: number): Promise<Category | null> => {
    try {
      const res = await axiosInstance.get<ApiResponse<Category>>(
        `/categories/${id}`
      );
      return res.data.data;
    } catch (error) {
      handleApiError(error);
      return null;
    }
  },

  createCategory: async (
    payload: CreateCategoryPayload
  ): Promise<Category | null> => {
    try {
      const res = await axiosInstance.post<ApiResponse<Category>>(
        '/categories',
        payload
      );
      return res.data.data;
    } catch (error) {
      handleApiError(error);
      return null;
    }
  },
};
