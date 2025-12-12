import axiosInstance from '@/lib/axios';
import { handleApiError } from '@/utils/error-handler';
import {
  Order,
  CreateOrderPayload,
  UpdateOrderStatePayload,
} from '@/types/order';
import { ApiResponse } from '@/types/response-data';

export const orderService = {
  getAllOrders: async (): Promise<Order[] | null> => {
    try {
      const res = await axiosInstance.get<ApiResponse<Order[]>>('/orders');
      return res.data.data;
    } catch (error) {
      handleApiError(error);
      return null;
    }
  },

  getMyOrders: async (): Promise<Order[] | null> => {
    try {
      const res = await axiosInstance.get<ApiResponse<Order[]>>(
        '/orders/my-orders'
      );
      return res.data.data;
    } catch (error) {
      handleApiError(error);
      return null;
    }
  },

  getMyDeliveries: async (): Promise<Order[] | null> => {
    try {
      const res = await axiosInstance.get<ApiResponse<Order[]>>(
        '/orders/my-deliveries'
      );
      return res.data.data;
    } catch (error) {
      handleApiError(error);
      return null;
    }
  },

  getOrderById: async (id: number): Promise<Order | null> => {
    try {
      const res = await axiosInstance.get<ApiResponse<Order>>(`/orders/${id}`);
      return res.data.data;
    } catch (error) {
      handleApiError(error);
      return null;
    }
  },

  createOrder: async (
    payload: CreateOrderPayload
  ): Promise<Order | null> => {
    try {
      const res = await axiosInstance.post<ApiResponse<Order>>(
        '/orders',
        payload
      );
      return res.data.data;
    } catch (error) {
      handleApiError(error);
      return null;
    }
  },

  updateOrderState: async (
    id: number,
    payload: UpdateOrderStatePayload
  ): Promise<Order | null> => {
    try {
      // Backend expects x-www-form-urlencoded format
      const formData = new URLSearchParams();
      formData.append('state', payload.state);

      const res = await axiosInstance.patch<ApiResponse<Order>>(
        `/orders/${id}/update-state`,
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      return res.data.data;
    } catch (error) {
      handleApiError(error);
      return null;
    }
  },

  cancelOrder: async (id: number): Promise<Order | null> => {
    try {
      const res = await axiosInstance.patch<ApiResponse<Order>>(
        `/orders/${id}/cancel`
      );
      return res.data.data;
    } catch (error) {
      handleApiError(error);
      return null;
    }
  },

  deleteOrder: async (id: number): Promise<boolean> => {
    try {
      await axiosInstance.delete(`/orders/${id}`);
      return true;
    } catch (error) {
      handleApiError(error);
      return false;
    }
  },
};
