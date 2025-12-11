import axiosInstance from '@/lib/axios';
import { handleApiError } from '@/utils/error-handler';
import { Product } from '@/types/inventory/product';
import { CreateProductPayloadType } from '@/app/(protected)/admin/inventory/components/product/schemas/create-product.schema';
import { ApiResponse } from '@/types/response-data';
import { AddStockPayloadType } from '@/app/(protected)/admin/inventory/components/product/stock/schemas/add-stock.schema';
import { RemoveStockPayloadType } from '@/app/(protected)/admin/inventory/components/product/stock/schemas/remove-stock.schema';

export const productService = {
  getAllProducts: async (): Promise<Product[] | null> => {
    try {
      const res = await axiosInstance.get<ApiResponse<Product[]>>('/products');
      return res.data.data;
    } catch (error) {
      handleApiError(error);
      return null;
    }
  },

  getProductById: async (id: number): Promise<Product | null> => {
    try {
      const res = await axiosInstance.get<ApiResponse<Product>>(
        `/products/${id}`
      );
      return res.data.data;
    } catch (error) {
      handleApiError(error);
      return null;
    }
  },

  createProduct: async (
    payload: CreateProductPayloadType
  ): Promise<Product | null> => {
    try {
      const res = await axiosInstance.post<ApiResponse<Product>>(
        '/products',
        payload
      );
      return res.data.data;
    } catch (error) {
      handleApiError(error);
      return null;
    }
  },

  updateProduct: async (
    id: number,
    payload: Partial<CreateProductPayloadType>
  ): Promise<Product | null> => {
    try {
      const res = await axiosInstance.put<ApiResponse<Product>>(
        `/products/${id}`,
        payload
      );
      return res.data.data;
    } catch (error) {
      handleApiError(error);
      return null;
    }
  },

  deleteProduct: async (id: number): Promise<boolean> => {
    try {
      await axiosInstance.delete(`/products/${id}`);
      return true;
    } catch (error) {
      handleApiError(error);
      return false;
    }
  },

  addStock: async (
    id: number,
    payload: AddStockPayloadType
  ): Promise<Product | null> => {
    try {
      const res = await axiosInstance.patch<ApiResponse<Product>>(
        `/products/${id}/stock/add`,
        payload
      );
      return res.data.data;
    } catch (error) {
      handleApiError(error);
      return null;
    }
  },

  removeStock: async (
    id: number,
    payload: RemoveStockPayloadType
  ): Promise<Product> => {
    const res = await axiosInstance.patch<ApiResponse<Product>>(
      `/products/${id}/stock/remove`,
      payload
    );
    return res.data.data;
  },

  getLowStockProducts: async (
    threshold?: number
  ): Promise<Product[] | null> => {
    try {
      const params = threshold ? { threshold } : undefined;
      const res = await axiosInstance.get<ApiResponse<Product[]>>(
        '/products/alerts/low-stock',
        { params }
      );
      return res.data.data;
    } catch (error) {
      handleApiError(error);
      return null;
    }
  },
};
