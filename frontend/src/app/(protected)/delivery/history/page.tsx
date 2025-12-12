'use client';

import { useState, useEffect, useMemo } from 'react';
import { Input, Spinner } from '@heroui/react';
import { IconSearch } from '@tabler/icons-react';
import { orderService } from '@/services/order.service';
import { Order, OrderState } from '@/types/order';
import { handleApiError } from '@/utils/error-handler';
import { OrderCard } from '@/components/customer/OrderCard';
import { OrderDetailModal } from '@/components/customer/OrderDetailModal';
import Title from '@/components/shared/Heading';

export default function DeliveryHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const data = await orderService.getMyDeliveries();
      if (!data) return;
      setOrders(data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const completedOrders = useMemo(() => {
    return orders.filter(
      (order) =>
        order.state === OrderState.DELIVERED ||
        order.state === OrderState.CANCEL
    );
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (!searchValue) return completedOrders;

    const search = searchValue.toLowerCase();
    return completedOrders.filter(
      (order) =>
        order.id.toString().includes(search) ||
        order.customer?.name.toLowerCase().includes(search) ||
        order.customer?.phoneNumber.includes(search)
    );
  }, [completedOrders, searchValue]);

  const handleDetailsClick = (orderId: number) => {
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setIsDetailModalOpen(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl pb-24">
      <div className="mb-6">
        <Title title="Historial" subtitle="Pedidos completados y cancelados" />
      </div>

      <div className="mb-6">
        <Input
          placeholder="Buscar por cliente o teléfono..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          startContent={<IconSearch size={18} className="text-default-400" />}
          variant="bordered"
          size="lg"
          classNames={{
            input: 'text-sm',
            inputWrapper: 'h-12 border-default-200',
          }}
          isClearable
          onClear={() => setSearchValue('')}
        />
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-default-400">
            {searchValue
              ? 'No se encontraron pedidos con ese criterio'
              : 'No tienes pedidos en tu historial'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onDetailsClick={handleDetailsClick}
              onUpdateState={loadOrders}
              viewMode="delivery"
            />
          ))}
        </div>
      )}

      {/* Order Detail Modal */}
      <OrderDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        order={selectedOrder}
        viewerRole="delivery"
      />
    </div>
  );
}
