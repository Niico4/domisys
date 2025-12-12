'use client';

import { useState, useEffect, useMemo } from 'react';
import { DateInput, Avatar, Spinner } from '@heroui/react';
import { CalendarDate } from '@internationalized/date';
import { Select, SelectItem } from '@heroui/react';
import { IconCalendar } from '@tabler/icons-react';
import { orderService } from '@/services/order.service';
import { Order, OrderState } from '@/types/order';
import { OrderCard } from '@/components/customer/OrderCard';
import { OrderDetailModal } from '@/components/customer/OrderDetailModal';
import { Greeting } from '@/components/customer/Greeting';
import { NotificationButton } from '@/components/shared/NotificationButton';
import { userService } from '@/services/user.service';
import { User } from '@/types/user';

const stateOptions = [
  { key: 'all', label: 'Todos' },
  { key: OrderState.PENDING, label: 'Pendiente' },
  { key: OrderState.CONFIRMED, label: 'Confirmado' },
  { key: OrderState.SHIPPED, label: 'En camino' },
  { key: OrderState.DELIVERED, label: 'Entregado' },
  { key: OrderState.CANCEL, label: 'Cancelado' },
];

export default function CustomerHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [, setDeliveries] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<CalendarDate | null>(null);
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // const fetchOrders = async () => {
  //   setIsLoading(true);
  //   const data = await orderService.getMyOrders();
  //   if (data) {
  //     setOrders(data);
  //   }
  //   setIsLoading(false);
  // };

  useEffect(() => {
    const fetchData = async () => {
      const [ordersData, deliveriesData] = await Promise.all([
        orderService.getMyOrders(),
        userService.getAllDeliveries(),
      ]);

      if (ordersData) setOrders(ordersData);
      if (deliveriesData) setDeliveries(deliveriesData);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    // Filter by date
    if (selectedDate) {
      const filterDate = new Date(
        selectedDate.year,
        selectedDate.month - 1,
        selectedDate.day
      );
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return (
          orderDate.getFullYear() === filterDate.getFullYear() &&
          orderDate.getMonth() === filterDate.getMonth() &&
          orderDate.getDate() === filterDate.getDate()
        );
      });
    }

    // Filter by state
    if (selectedState !== 'all') {
      filtered = filtered.filter((order) => order.state === selectedState);
    }

    // Sort by most recent first
    return filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [orders, selectedDate, selectedState]);

  const handleDetailsClick = (orderId: number) => {
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setIsDetailModalOpen(true);
    }
  };

  const handleNotifications = () => {
    console.log('Opening notifications');
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 min-h-screen">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
            <Avatar
              size="md"
              className="w-10 h-10 sm:w-12 sm:h-12 shrink-0"
              color="default"
            />
            <div className="flex-1 min-w-0">
              <Greeting />
            </div>
          </div>

          <div className="shrink-0">
            <NotificationButton onClick={handleNotifications} />
          </div>
        </header>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <DateInput
            label="Fecha"
            value={selectedDate}
            onChange={setSelectedDate}
            startContent={
              <IconCalendar size={18} className="text-default-400" />
            }
            className="flex-1"
            variant="bordered"
          />

          <Select
            label="Estado"
            placeholder="Selecciona un estado"
            selectedKeys={selectedState ? [selectedState] : []}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string;
              setSelectedState(value || 'all');
            }}
            className="flex-1"
            variant="bordered"
          >
            {stateOptions.map((option) => (
              <SelectItem key={option.key}>{option.label}</SelectItem>
            ))}
          </Select>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" color="primary" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-default-500 mb-2">
              {orders.length === 0
                ? 'No tienes pedidos aún'
                : 'No se encontraron pedidos con los filtros seleccionados'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onDetailsClick={handleDetailsClick}
                viewMode="customer"
              />
            ))}
          </div>
        )}

        {/* Order Detail Modal */}
        <OrderDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          order={selectedOrder}
          viewerRole="customer"
        />
      </div>
    </div>
  );
}
