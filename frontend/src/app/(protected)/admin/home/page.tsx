'use client';

import { useEffect, useState } from 'react';
import { Spinner } from '@heroui/react';
import {
  IconPackage,
  IconUsers,
  IconKey,
  IconAlertTriangle,
} from '@tabler/icons-react';
import { productService } from '@/services/product.service';
import { userService } from '@/services/user.service';
import { accessCodeService } from '@/services/access-code.service';
import type { Product } from '@/types/inventory/product';
import type { User } from '@/types/user';
import type { AccessCode } from '@/types/user-management/access-code';
import { AccessCodeState } from '@/types/user-management/access-code';
import { ProductState } from '@/types/inventory/enums/product-state';
import { StatCard } from './components/StatCard';
import { ProductListItem } from './components/ProductListItem';
import { CodeListItem } from './components/CodeListItem';
import { UserListItem } from './components/UserListItem';
import { DashboardSection } from './components/DashboardSection';

const AdminHomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [accessCodes, setAccessCodes] = useState<AccessCode[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          productsData,
          adminsData,
          deliveriesData,
          accessCodesData,
          lowStockData,
        ] = await Promise.all([
          productService.getAllProducts(),
          userService.getAllAdmins(),
          userService.getAllDeliveries(),
          accessCodeService.getAll(),
          productService.getLowStockProducts(),
        ]);

        setProducts(productsData ?? []);
        setUsers([...adminsData, ...deliveriesData]);
        setAccessCodes(accessCodesData);
        setLowStockProducts((lowStockData ?? []).map((p: Product) => p.id));
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Productos',
      value: products.length,
      icon: IconPackage,
      color: 'primary' as const,
      bgColor: 'bg-primary-50',
      iconColor: 'text-primary',
      description: `${
        products.filter((p) => p.state === ProductState.active).length
      } disponibles`,
    },
    {
      title: 'Productos Bajos en Stock',
      value: lowStockProducts.length,
      icon: IconAlertTriangle,
      color: 'warning' as const,
      bgColor: 'bg-warning-50',
      iconColor: 'text-warning',
      description: 'Requieren atención',
    },
    {
      title: 'Total Usuarios',
      value: users.length,
      icon: IconUsers,
      color: 'success' as const,
      bgColor: 'bg-success-50',
      iconColor: 'text-success',
      description: `${users.filter((u) => u.role === 'admin').length} admins, ${
        users.filter((u) => u.role === 'delivery').length
      } repartidores`,
    },
    {
      title: 'Códigos Disponibles',
      value: accessCodes.filter((c) => c.status === AccessCodeState.active)
        .length,
      icon: IconKey,
      color: 'secondary' as const,
      bgColor: 'bg-secondary-50',
      iconColor: 'text-secondary',
      description: `${accessCodes.length} total`,
    },
  ];

  const productsWithLowStock = products.filter((p) =>
    lowStockProducts.includes(p.id)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-default-500">
          Resumen general del sistema de inventario
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DashboardSection
          title="Productos Bajos en Stock"
          badge={{ label: productsWithLowStock.length, color: 'warning' }}
          emptyMessage={
            productsWithLowStock.length === 0
              ? 'No hay productos con bajo stock'
              : undefined
          }
        >
          <div className="space-y-3">
            {productsWithLowStock.slice(0, 5).map((product) => (
              <ProductListItem key={product.id} product={product} />
            ))}
          </div>
        </DashboardSection>

        <DashboardSection
          title="Resumen de Códigos"
          badge={{
            label: `${accessCodes.filter((c) => c.status === AccessCodeState.active).length} activos`,
            color: 'secondary',
          }}
          emptyMessage={
            accessCodes.length === 0 ? 'No hay códigos de acceso' : undefined
          }
        >
          <div className="space-y-3">
            {accessCodes.slice(0, 5).map((code) => (
              <CodeListItem key={code.id} code={code} />
            ))}
          </div>
        </DashboardSection>
      </div>

      <DashboardSection
        title="Usuarios del Sistema"
        badge={{ label: `${users.length} activos` }}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {users.slice(0, 6).map((user) => (
            <UserListItem key={user.id} user={user} />
          ))}
        </div>
      </DashboardSection>
    </div>
  );
};

export default AdminHomePage;
