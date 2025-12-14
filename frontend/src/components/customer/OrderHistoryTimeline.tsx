'use client';

import { useEffect, useState } from 'react';
import { Card, CardBody, Chip } from '@heroui/react';
import {
  IconCheck,
  IconTruck,
  IconPackage,
  IconX,
  IconClock,
} from '@tabler/icons-react';
import { OrderState } from '@/types/order';
import {
  orderTrackingService,
  OrderStateChange,
} from '@/services/order-tracking.service';

interface OrderHistoryTimelineProps {
  orderId: number;
  currentState: OrderState;
}

const StateIcons: Record<OrderState, typeof IconCheck> = {
  [OrderState.PENDING]: IconClock,
  [OrderState.CONFIRMED]: IconCheck,
  [OrderState.SHIPPED]: IconTruck,
  [OrderState.DELIVERED]: IconPackage,
  [OrderState.CANCEL]: IconX,
};

const StateLabels: Record<OrderState, string> = {
  [OrderState.PENDING]: 'Pendiente',
  [OrderState.CONFIRMED]: 'Confirmado',
  [OrderState.SHIPPED]: 'En camino',
  [OrderState.DELIVERED]: 'Entregado',
  [OrderState.CANCEL]: 'Cancelado',
};

const StateColors: Record<OrderState, 'warning' | 'primary' | 'success' | 'danger' | 'default'> = {
  [OrderState.PENDING]: 'warning',
  [OrderState.CONFIRMED]: 'primary',
  [OrderState.SHIPPED]: 'primary',
  [OrderState.DELIVERED]: 'success',
  [OrderState.CANCEL]: 'danger',
};

const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleString('es-CO', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const OrderHistoryTimeline = ({
  orderId,
  currentState,
}: OrderHistoryTimelineProps) => {
  const [changes, setChanges] = useState<OrderStateChange[]>([]);
  const [cancellationReason, setCancellationReason] = useState<string>();

  useEffect(() => {
    const history = orderTrackingService.getOrderHistory(orderId);
    if (history) {
      setChanges(history.changes);
      setCancellationReason(history.cancellationReason);
    }
  }, [orderId, currentState]);

  if (changes.length === 0) {
    return (
      <div className="text-center py-4 text-default-500 text-sm">
        No hay historial de cambios registrado
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {cancellationReason && currentState === OrderState.CANCEL && (
        <Card className="bg-danger-50 border border-danger-200">
          <CardBody className="p-3">
            <div className="flex items-start gap-2">
              <IconX size={18} className="text-danger-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-danger-700">
                  Motivo de cancelación
                </p>
                <p className="text-sm text-danger-600">{cancellationReason}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      <div className="relative">
        {changes.map((change, index) => {
          const Icon = StateIcons[change.toState];
          const isLast = index === changes.length - 1;

          return (
            <div key={index} className="flex gap-3 pb-4 relative">
              {/* Timeline line */}
              {!isLast && (
                <div className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-default-200" />
              )}

              {/* Icon */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 bg-${StateColors[change.toState]}-100`}
              >
                <Icon
                  size={16}
                  className={`text-${StateColors[change.toState]}-600`}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Chip
                    size="sm"
                    color={StateColors[change.toState]}
                    variant="flat"
                  >
                    {StateLabels[change.toState]}
                  </Chip>
                  <span className="text-xs text-default-400">
                    {formatDate(change.changedAt)}
                  </span>
                </div>
                {change.reason && (
                  <p className="text-sm text-default-600 mt-1">
                    {change.reason}
                  </p>
                )}
                <p className="text-xs text-default-400 mt-0.5">
                  Por:{' '}
                  {change.changedBy === 'delivery'
                    ? 'Repartidor'
                    : change.changedBy === 'customer'
                    ? 'Cliente'
                    : 'Sistema'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
