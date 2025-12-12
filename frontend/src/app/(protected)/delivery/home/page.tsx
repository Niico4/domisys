'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  Spinner,
  Avatar,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@heroui/react';
import {
  IconPackage,
  IconTruck,
  IconCash,
  IconAlertTriangle,
} from '@tabler/icons-react';
import { orderService } from '@/services/order.service';
import { Order, OrderState } from '@/types/order';
import { OrderCard } from '@/components/customer/OrderCard';
import { OrderDetailModal } from '@/components/customer/OrderDetailModal';
import { formatPrice } from '@/utils/format.utils';
import { handleApiError } from '@/utils/error-handler';
import { Greeting } from '@/components/customer/Greeting';
import { NotificationButton } from '@/components/shared/NotificationButton';

interface DeliveryStats {
  completedOrders: number;
  activeOrders: number;
  totalEarnings: number;
}

export default function DeliveryHomePage() {
  const [stats, setStats] = useState<DeliveryStats>({
    completedOrders: 0,
    activeOrders: 0,
    totalEarnings: 0,
  });
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<number | null>(null);

  const handleNotifications = () => {
    // TODO: Implement notifications
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const ordersData = await orderService.getMyDeliveries();

      if (ordersData) {
        const active = ordersData.filter(
          (order) =>
            order.state === OrderState.PENDING ||
            order.state === OrderState.CONFIRMED ||
            order.state === OrderState.SHIPPED
        );
        setActiveOrders(active);

        const completed = ordersData.filter(
          (order) => order.state === OrderState.DELIVERED
        );
        const totalEarnings = completed.reduce(
          (sum, order) => sum + Number(order.totalAmount),
          0
        );

        setStats({
          completedOrders: completed.length,
          activeOrders: active.length,
          totalEarnings,
        });
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateState = async (orderId: number, newState: OrderState) => {
    try {
      const result = await orderService.updateOrderState(orderId, {
        state: newState,
      });

      if (result) {
        await loadData();
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleCancelOrder = (orderId: number) => {
    setOrderToCancel(orderId);
    setIsCancelModalOpen(true);
  };

  const confirmCancelOrder = async () => {
    if (!orderToCancel) return;

    try {
      const result = await orderService.cancelOrder(orderToCancel);

      if (result) {
        setIsCancelModalOpen(false);
        setOrderToCancel(null);
        await loadData();
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleDetailsClick = (orderId: number) => {
    const order = activeOrders.find((o) => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setIsDetailModalOpen(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen  pb-20">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <header className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
            <Avatar
              size="lg"
              className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 ring-2 ring-primary/20"
              color="primary"
            />
            <div className="flex-1 min-w-0">
              <Greeting />
            </div>
          </div>

          <div className="shrink-0">
            <NotificationButton onClick={handleNotifications} />
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <Card className="bg-linear-to-br from-success-50 to-success-100 dark:from-success-900/30 dark:to-success-800/30 border border-success-200 dark:border-success-800 shadow-lg hover:shadow-xl transition-shadow">
            <CardBody className="p-4 sm:p-5">
              <div className="flex flex-col items-center text-center gap-2.5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-success-500/10 rounded-2xl flex items-center justify-center ring-2 ring-success-500/20">
                  <IconPackage
                    size={24}
                    className="text-success-600 dark:text-success-400"
                    stroke={2}
                  />
                </div>
                <div>
                  <p className="text-success-900 dark:text-success-100 text-3xl sm:text-4xl font-bold">
                    {stats.completedOrders}
                  </p>
                  <p className="text-success-700 dark:text-success-300 text-xs sm:text-sm font-semibold mt-1">
                    Completados
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-linear-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 border border-primary-200 dark:border-primary-800 shadow-lg hover:shadow-xl transition-shadow">
            <CardBody className="p-4 sm:p-5">
              <div className="flex flex-col items-center text-center gap-2.5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary-500/10 rounded-2xl flex items-center justify-center ring-2 ring-primary-500/20">
                  <IconTruck
                    size={24}
                    className="text-primary-600 dark:text-primary-400"
                    stroke={2}
                  />
                </div>
                <div>
                  <p className="text-primary-900 dark:text-primary-100 text-3xl sm:text-4xl font-bold">
                    {stats.activeOrders}
                  </p>
                  <p className="text-primary-700 dark:text-primary-300 text-xs sm:text-sm font-semibold mt-1">
                    Activos
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-linear-to-br from-warning-50 to-warning-100 dark:from-warning-900/30 dark:to-warning-800/30 border border-warning-200 dark:border-warning-800 shadow-lg hover:shadow-xl transition-shadow">
            <CardBody className="p-4 sm:p-5">
              <div className="flex flex-col items-center text-center gap-2.5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-warning-500/10 rounded-2xl flex items-center justify-center ring-2 ring-warning-500/20">
                  <IconCash
                    size={24}
                    className="text-warning-600 dark:text-warning-400"
                    stroke={2}
                  />
                </div>
                <div>
                  <p className="text-warning-900 dark:text-warning-100 text-xl sm:text-2xl font-bold">
                    {formatPrice(stats.totalEarnings)}
                  </p>
                  <p className="text-warning-700 dark:text-warning-300 text-xs sm:text-sm font-semibold mt-1">
                    Ganancias
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Active Orders List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-default-900">
              Pedidos Activos
            </h2>
            {activeOrders.length > 0 && (
              <span className="text-sm text-default-500 font-medium">
                {activeOrders.length}{' '}
                {activeOrders.length === 1 ? 'pedido' : 'pedidos'}
              </span>
            )}
          </div>

          {activeOrders.length === 0 ? (
            <Card className="bg-default-100/50 backdrop-blur-sm border border-default-200">
              <CardBody className="p-12 text-center">
                <div className="w-20 h-20 bg-default-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconTruck
                    size={40}
                    className="text-default-500"
                    stroke={1.5}
                  />
                </div>
                <p className="text-default-700 font-semibold text-lg mb-2">
                  No tienes pedidos activos
                </p>
                <p className="text-sm text-default-500 max-w-sm mx-auto">
                  Los pedidos que te sean asignados aparecerán aquí
                </p>
              </CardBody>
            </Card>
          ) : (
            <div className="space-y-3">
              {activeOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  viewMode="delivery"
                  onUpdateState={handleUpdateState}
                  onCancelOrder={handleCancelOrder}
                  onDetailsClick={handleDetailsClick}
                />
              ))}
            </div>
          )}
        </div>

        {/* Order Detail Modal */}
        <OrderDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          order={selectedOrder}
          viewerRole="delivery"
        />

        {/* Cancel Order Confirmation Modal */}
        <Modal
          isOpen={isCancelModalOpen}
          onClose={() => {
            setIsCancelModalOpen(false);
            setOrderToCancel(null);
          }}
          size="sm"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-full bg-danger-100">
                      <IconAlertTriangle
                        size={24}
                        className="text-danger-600"
                      />
                    </div>
                    <span>Cancelar Pedido</span>
                  </div>
                </ModalHeader>
                <ModalBody>
                  <p className="text-default-600">
                    ¿Estás seguro de que deseas cancelar este pedido? Esta
                    acción no se puede deshacer.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button variant="light" onPress={onClose}>
                    No, mantener
                  </Button>
                  <Button
                    color="danger"
                    onPress={confirmCancelOrder}
                    startContent={<IconAlertTriangle size={18} />}
                  >
                    Sí, cancelar
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
