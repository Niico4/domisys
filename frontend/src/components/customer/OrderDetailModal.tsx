'use client';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Divider,
  Chip,
} from '@heroui/react';
import { Order, OrderState } from '@/types/order';
import { formatPrice } from '@/utils/format.utils';
import { IconReceipt, IconHistory } from '@tabler/icons-react';
import { OrderHistoryTimeline } from './OrderHistoryTimeline';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  viewerRole: 'customer' | 'delivery';
}

const OrderStateLabels: Record<OrderState, string> = {
  [OrderState.PENDING]: 'Pendiente',
  [OrderState.CONFIRMED]: 'Confirmado',
  [OrderState.SHIPPED]: 'En camino',
  [OrderState.DELIVERED]: 'Entregado',
  [OrderState.CANCEL]: 'Cancelado',
};

const PaymentMethodLabels: Record<string, string> = {
  cash: 'Efectivo',
  nequi: 'Nequi',
  credit_card: 'Tarjeta',
  daviplata: 'Daviplata',
};

const getStateColor = (state: OrderState) => {
  switch (state) {
    case OrderState.PENDING:
      return 'warning';
    case OrderState.CONFIRMED:
      return 'primary';
    case OrderState.SHIPPED:
      return 'secondary';
    case OrderState.DELIVERED:
      return 'success';
    case OrderState.CANCEL:
      return 'danger';
    default:
      return 'default';
  }
};

export const OrderDetailModal = ({
  isOpen,
  onClose,
  order,
  viewerRole,
}: OrderDetailModalProps) => {
  if (!order) return null;

  const subtotal =
    order.orderProducts?.reduce(
      (acc, item) => acc + Number(item.unitPrice) * item.quantity,
      0
    ) || 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      scrollBehavior="inside"
      classNames={{
        base: 'bg-white',
        header: 'border-b border-divider',
        body: 'py-6',
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <IconReceipt size={24} className="text-primary" />
            <h3 className="text-xl font-bold">Detalle del Pedido</h3>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-default-500">Orden #{order.id}</span>
            <Chip
              size="sm"
              color={getStateColor(order.state)}
              variant="flat"
              className="font-medium"
            >
              {OrderStateLabels[order.state]}
            </Chip>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            {/* Productos */}
            <div>
              <h4 className="text-sm font-semibold text-default-700 mb-3">
                Productos
              </h4>
              <div className="space-y-3">
                {order.orderProducts?.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-start justify-between gap-3 p-3 bg-default-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-default-900">
                        {item.product?.name || `Producto #${item.productId}`}
                      </p>
                      <p className="text-xs text-default-500 mt-1">
                        Cantidad: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-default-900">
                        {formatPrice(Number(item.unitPrice) * item.quantity)}
                      </p>
                      <p className="text-xs text-default-500 mt-1">
                        {formatPrice(item.unitPrice)} c/u
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Divider />

            {/* Información de Pago */}
            <div>
              <h4 className="text-sm font-semibold text-default-700 mb-3">
                Resumen de Pago
              </h4>
              <div className="space-y-3 p-4 bg-linear-to-br from-default-50 to-default-100 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-default-600">Subtotal</span>
                  <span className="text-sm font-medium text-default-900">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-default-600">
                    Método de pago
                  </span>
                  <span className="text-sm font-medium text-default-900">
                    {PaymentMethodLabels[order.paymentMethod] ||
                      order.paymentMethod}
                  </span>
                </div>
                <Divider className="my-2" />
                <div className="flex justify-between items-center pt-2">
                  <span className="text-base font-bold text-default-900">
                    Total
                  </span>
                  <span className="text-xl font-bold text-primary">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Información del Usuario (Cliente o Repartidor) */}
            {viewerRole === 'customer' && order.delivery ? (
              <>
                <Divider />
                <div>
                  <h4 className="text-sm font-semibold text-default-700 mb-3">
                    Repartidor Asignado
                  </h4>
                  <div className="p-4 bg-default-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-bold text-sm">
                          {order.delivery.name[0]}
                          {order.delivery.lastName?.[0] || ''}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-default-900">
                          {order.delivery.name} {order.delivery.lastName || ''}
                        </p>
                        <p className="text-xs text-default-600 mt-0.5">
                          {order.delivery.phoneNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : viewerRole === 'delivery' && order.customer ? (
              <>
                <Divider />
                <div>
                  <h4 className="text-sm font-semibold text-default-700 mb-3">
                    Información del Cliente
                  </h4>
                  <div className="p-4 bg-default-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-bold text-sm">
                          {order.customer.name[0]}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-default-900">
                          {order.customer.name}
                        </p>
                        <p className="text-xs text-default-600 mt-0.5">
                          {order.customer.phoneNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : null}

            {/* Fechas */}
            <Divider />
            <div>
              <h4 className="text-sm font-semibold text-default-700 mb-3">
                Información del Pedido
              </h4>
              <div className="p-4 bg-default-50 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-default-600">
                    Fecha de pedido
                  </span>
                  <span className="text-sm font-medium text-default-900">
                    {new Date(order.createdAt).toLocaleDateString('es-CO', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Historial de Cambios */}
            <Divider />
            <div>
              <h4 className="text-sm font-semibold text-default-700 mb-3 flex items-center gap-2">
                <IconHistory size={18} />
                Historial del Pedido
              </h4>
              <OrderHistoryTimeline orderId={order.id} currentState={order.state} />
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
