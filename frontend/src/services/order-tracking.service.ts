import { OrderState } from '@/types/order';

export interface OrderStateChange {
  orderId: number;
  fromState: OrderState | null;
  toState: OrderState;
  reason?: string;
  changedBy: 'customer' | 'delivery' | 'system';
  changedAt: string;
}

export interface OrderTrackingHistory {
  orderId: number;
  changes: OrderStateChange[];
  cancellationReason?: string;
}

const STORAGE_KEY = 'order_tracking_history';

const getStoredHistory = (): Record<number, OrderTrackingHistory> => {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const saveHistory = (history: Record<number, OrderTrackingHistory>): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
};

export const orderTrackingService = {
  addStateChange: (
    orderId: number,
    fromState: OrderState | null,
    toState: OrderState,
    changedBy: 'customer' | 'delivery' | 'system',
    reason?: string
  ): void => {
    const history = getStoredHistory();

    if (!history[orderId]) {
      history[orderId] = {
        orderId,
        changes: [],
      };
    }

    const change: OrderStateChange = {
      orderId,
      fromState,
      toState,
      reason,
      changedBy,
      changedAt: new Date().toISOString(),
    };

    history[orderId].changes.push(change);

    if (toState === OrderState.CANCEL && reason) {
      history[orderId].cancellationReason = reason;
    }

    saveHistory(history);
  },

  getOrderHistory: (orderId: number): OrderTrackingHistory | null => {
    const history = getStoredHistory();
    return history[orderId] || null;
  },

  getCancellationReason: (orderId: number): string | undefined => {
    const history = getStoredHistory();
    return history[orderId]?.cancellationReason;
  },

  getAllHistory: (): Record<number, OrderTrackingHistory> => {
    return getStoredHistory();
  },

  clearOrderHistory: (orderId: number): void => {
    const history = getStoredHistory();
    delete history[orderId];
    saveHistory(history);
  },
};
