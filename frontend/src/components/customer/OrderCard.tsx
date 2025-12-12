'use client';

import { Card, CardBody, Button } from '@heroui/react';
import { IconCheck, IconReceipt } from '@tabler/icons-react';
import { Order, OrderState } from '@/types/order';
import { formatPrice } from '@/utils/format.utils';

interface OrderCardProps {
  order: Order;
  onDetailsClick?: (orderId: number) => void;
}

const OrderStateLabels: Record<OrderState, string> = {
  [OrderState.PENDING]: 'Pendiente',
  [OrderState.CONFIRMED]: 'Confirmado',
  [OrderState.SHIPPED]: 'En camino',
  [OrderState.DELIVERED]: 'Entregado',
  [OrderState.CANCEL]: 'Cancelado',
};

const orderStates: OrderState[] = [
  OrderState.PENDING,
  OrderState.CONFIRMED,
  OrderState.SHIPPED,
  OrderState.DELIVERED,
];

export const OrderCard = ({ order, onDetailsClick }: OrderCardProps) => {
  const currentStateIndex = orderStates.indexOf(order.state);
  const isCanceled = order.state === OrderState.CANCEL;

  const getDeliveryPersonInfo = () => {
    if (order.deliveryId) {
      return {
        hasDelivery: true,
        name: 'Repartidor asignado',
        identifier: 'XXXXXXXXXX',
      };
    }
    return {
      hasDelivery: false,
      name: 'Sin repartidor',
      identifier: 'XXXXXXXXXX',
    };
  };

  const deliveryInfo = getDeliveryPersonInfo();

  return (
    <Card className="w-full bg-[#F1F1F1] shadow-sm">
      <CardBody className="p-4 space-y-4">
        {/* Delivery Person and Order Info */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full bg-default-300 flex items-center justify-center flex-shrink-0">
              <span className="text-xs text-default-600">DP</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-default-900">
                {deliveryInfo.name}
              </p>
              <p className="text-xs text-default-500">{deliveryInfo.identifier}</p>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xs text-default-500 mb-1">NO. {order.id}</p>
            <p className="text-lg font-bold text-default-900">
              {formatPrice(order.totalAmount)}
            </p>
          </div>
        </div>

        {/* Status Tracker */}
        {!isCanceled && (
          <div className="space-y-3 pt-2">
            {/* Step Indicators */}
            <div className="flex items-center justify-between relative">
              {orderStates.map((state, index) => {
                const isCompleted = index < currentStateIndex;
                const isCurrent = index === currentStateIndex;
                const isActive = index <= currentStateIndex;

                return (
                  <div key={state} className="flex items-center flex-1 relative z-10">
                    <div className="flex flex-col items-center flex-1 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isActive
                            ? 'bg-primary-600 text-white'
                            : 'bg-default-200 border-2 border-default-300'
                        }`}
                      >
                        {isCompleted && (
                          <IconCheck size={16} stroke={3} className="text-white" />
                        )}
                        {isCurrent && !isCompleted && (
                          <div className="w-3 h-3 rounded-full bg-white" />
                        )}
                      </div>
                    </div>
                    {index < orderStates.length - 1 && (
                      <div
                        className={`h-1 flex-1 mx-2 ${
                          isCompleted ? 'bg-primary-600' : 'bg-default-200'
                        }`}
                        style={{ minWidth: '20px' }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            {/* Step Labels */}
            <div className="flex items-start justify-between px-1">
              {orderStates.map((state, index) => {
                const isCurrent = index === currentStateIndex;
                const isActive = index <= currentStateIndex;

                return (
                  <div
                    key={`label-${state}`}
                    className="flex-1 text-center min-w-0 px-1"
                  >
                    <p
                      className={`text-xs leading-tight ${
                        isCurrent
                          ? 'font-semibold text-primary-600'
                          : isActive
                          ? 'text-default-700'
                          : 'text-default-400'
                      }`}
                    >
                      {OrderStateLabels[state]}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {isCanceled && (
          <div className="text-center py-2">
            <p className="text-sm font-semibold text-red-600">
              {OrderStateLabels[OrderState.CANCEL]}
            </p>
          </div>
        )}

        {/* Details Button */}
        <Button
          className="w-full bg-primary-600 text-white font-medium rounded-lg py-2"
          onPress={() => onDetailsClick?.(order.id)}
          startContent={<IconReceipt size={18} />}
        >
          Detalles
        </Button>
      </CardBody>
    </Card>
  );
};
