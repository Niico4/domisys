import axiosInstance from '@/lib/axios';
import {
  InventoryMovement,
  InventoryMovementFilters,
} from '@/types/inventory/inventory-movement';
import { ApiResponse } from '@/types/response-data';

export const inventoryMovementService = {
  getMovements: async (
    filters?: InventoryMovementFilters
  ): Promise<InventoryMovement[]> => {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.productId)
      params.append('productId', filters.productId.toString());

    const response = await axiosInstance.get<ApiResponse<InventoryMovement[]>>(
      `/products/reports/inventory-movement${
        params.toString() ? `?${params.toString()}` : ''
      }`
    );
    return response.data.data;
  },
};
