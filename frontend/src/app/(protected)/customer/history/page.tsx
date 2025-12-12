'use client';

import { useState, useEffect, useMemo } from 'react';
import { DateInput } from '@heroui/react';
import { parseDate, CalendarDate } from '@internationalized/date';
import { Select, SelectItem } from '@heroui/react';
import { IconCalendar } from '@tabler/icons-react';
import { Spinner } from '@heroui/react';
import { orderService } from '@/services/order.service';
import { Order, OrderState } from '@/types/order';
import { OrderCard } from '@/components/customer/OrderCard';

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
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<CalendarDate | null>(null);
  const [selectedState, setSelectedState] = useState<string>('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    const data = await orderService.getMyOrders();
    if (data) {
      setOrders(data);
    }
    setIsLoading(false);
  };

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
    // TODO: Navigate to order details page or open modal
    console.log('View details for order:', orderId);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 min-h-screen">
      <div className="max-w-2xl mx-auto">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-primary-600 text-center mb-6">
          Mis Pedidos
        </h1>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <DateInput
            label="Fecha"
            placeholder="mm/dd/yyyy"
            value={selectedDate}
            onChange={setSelectedDate}
            startContent={<IconCalendar size={18} className="text-default-400" />}
            className="flex-1"
            variant="bordered"
            isClearable
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
              <SelectItem key={option.key} value={option.key}>
                {option.label}
              </SelectItem>
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
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
