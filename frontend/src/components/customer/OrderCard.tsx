'use client';

import { useEffect, useState } from 'react';
import { Card, CardBody, Button, Avatar } from '@heroui/react';
import { IconCheck, IconReceipt, IconX } from '@tabler/icons-react';
import { Order, OrderState } from '@/types/order';
import { formatPrice } from '@/utils/format.utils';
import { orderTrackingService } from '@/services/order-tracking.service';

interface OrderCardProps {
  order: Order;
  onDetailsClick?: (orderId: number) => void;
  viewMode?: 'customer' | 'delivery';
  onUpdateState?: (orderId: number, newState: OrderState) => void;
  onCancelOrder?: (orderId: number) => void;
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

export const OrderCard = ({
  order,
  onDetailsClick,
  viewMode = 'customer',
  onUpdateState,
  onCancelOrder,
}: OrderCardProps) => {
  const [cancellationReason, setCancellationReason] = useState<string>();
  const currentStateIndex = orderStates.indexOf(order.state);
  const isCanceled = order.state === OrderState.CANCEL;

  useEffect(() => {
    if (isCanceled) {
      const reason = orderTrackingService.getCancellationReason(order.id);
      setCancellationReason(reason);
    }
  }, [isCanceled, order.id]);

  const getNextStateButton = () => {
    if (isCanceled || order.state === OrderState.DELIVERED) return null;

    const stateActions: Record<
      OrderState,
      { label: string; nextState: OrderState } | null
    > = {
      [OrderState.PENDING]: {
        label: 'Confirmar pedido',
        nextState: OrderState.CONFIRMED,
      },
      [OrderState.CONFIRMED]: {
        label: 'Entregar pedido',
        nextState: OrderState.SHIPPED,
      },
      [OrderState.SHIPPED]: {
        label: 'Pedido completado',
        nextState: OrderState.DELIVERED,
      },
      [OrderState.DELIVERED]: null,
      [OrderState.CANCEL]: null,
    };

    return stateActions[order.state];
  };

  const nextAction = getNextStateButton();

  const getPersonInfo = () => {
    if (viewMode === 'delivery') {
      // Vista de repartidor: mostrar cliente
      if (order.customer) {
        return {
          label: 'Cliente',
          name: `${order.customer.name} ${order.customer.lastName}`,
          identifier: order.customer.phoneNumber,
        };
      }
      return {
        label: 'Cliente',
        name: 'Sin información',
        identifier: 'N/A',
      };
    }

    // Vista de cliente: mostrar repartidor
    if (order.delivery) {
      return {
        label: 'Repartidor',
        name: `${order.delivery.name} ${order.delivery.lastName}`,
        identifier: order.delivery.phoneNumber,
      };
    }

    return {
      label: 'Repartidor',
      name: 'Sin asignar',
      identifier: 'N/A',
    };
  };

  const personInfo = getPersonInfo();

  return (
    <Card className="w-full bg-[#F1F1F1] shadow-sm">
      <CardBody className="p-4 space-y-4">
        {/* Delivery Person and Order Info */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full bg-default-300 flex items-center justify-center shrink-0">
              {/* <span className="text-xs text-default-600 font-semibold">
                {viewMode === 'delivery' ? 'C' : 'R'}
              </span> */}
              <Avatar name={`${personInfo.name} `} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-default-500 mb-0.5">
                {personInfo.label}
              </p>
              <p className="text-sm font-medium text-default-900">
                {personInfo.name}
              </p>
              <p className="text-xs text-default-500">
                {personInfo.identifier}
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-default-500 mb-1">NO. {order.id}</p>
            <p className="text-lg font-bold text-default-900">
              {formatPrice(order.totalAmount)}
            </p>
          </div>
        </div>

        {/* Status Tracker */}
        {!isCanceled && (
          <div className="pt-2">
            <div className="flex items-start relative">
              {/* Connecting Lines - positioned absolutely between circle centers */}
              {orderStates.slice(0, -1).map((_, index) => {
                const isCompleted = index < currentStateIndex;
                // Calculate positions: each step is flex-1, so centers are at (2n+1)/(2*numSteps) * 100%
                const startPercent =
                  ((2 * index + 1) / (2 * orderStates.length)) * 100;
                const endPercent =
                  ((2 * (index + 1) + 1) / (2 * orderStates.length)) * 100;
                const width = endPercent - startPercent;

                return (
                  <div
                    key={`line-${index}`}
                    className={`absolute h-1 top-3.5 z-0 ${
                      isCompleted ? 'bg-primary-600' : 'bg-default-200'
                    }`}
                    style={{
                      left: `${startPercent}%`,
                      width: `${width}%`,
                    }}
                  />
                );
              })}
              {/* Step Indicators and Labels */}
              {orderStates.map((state, index) => {
                const isCompleted = index < currentStateIndex;
                const isCurrent = index === currentStateIndex;
                const isActive = index <= currentStateIndex;

                return (
                  <div
                    key={state}
                    className="flex flex-col items-center flex-1 relative z-10"
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                        isActive
                          ? 'bg-primary-600 text-white'
                          : 'bg-default-200 border-2 border-default-300'
                      }`}
                    >
                      {isCompleted && (
                        <IconCheck
                          size={16}
                          stroke={3}
                          className="text-white"
                        />
                      )}
                      {isCurrent && !isCompleted && (
                        <div className="w-3 h-3 rounded-full bg-white" />
                      )}
                    </div>
                    <p
                      className={`text-xs leading-tight mt-2 text-center ${
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
          <div className="py-2 px-3 bg-danger-50 rounded-lg border border-danger-200">
            <p className="text-sm font-semibold text-danger-600 text-center">
              {OrderStateLabels[OrderState.CANCEL]}
            </p>
            {cancellationReason && (
              <p className="text-xs text-danger-500 mt-1 text-center">
                Motivo: {cancellationReason}
              </p>
            )}
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

        {/* Delivery Actions */}
        {viewMode === 'delivery' && !isCanceled && (
          <div className="flex gap-2">
            {nextAction && (
              <Button
                className="flex-1 bg-primary-600 text-white font-medium rounded-lg py-2"
                onPress={() => onUpdateState?.(order.id, nextAction.nextState)}
              >
                {nextAction.label}
              </Button>
            )}
            {order.state !== OrderState.DELIVERED && (
              <Button
                className="bg-danger-600 text-white font-medium rounded-lg py-2"
                onPress={() => onCancelOrder?.(order.id)}
                startContent={<IconX size={18} />}
                isIconOnly={!!nextAction}
              >
                {!nextAction && 'Cancelar'}
              </Button>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
};
