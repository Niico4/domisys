import { NavItem } from '@/components/shared/sidebar/Sidebar';
import {
  IconDeviceAnalytics,
  IconPackage,
  IconUsersGroup,
  IconSettings,
} from '@tabler/icons-react';

export const adminNavItems: NavItem[] = [
  {
    name: 'Panel de Control',
    href: '/admin/home',
    icon: IconDeviceAnalytics,
  },
  {
    name: 'Inventario',
    href: '/admin/inventory',
    icon: IconPackage,
  },
  // {
  //   name: 'Pedidos',
  //   href: '/admin/orders',
  //   icon: IconClipboardList,
  // },
  // {
  //   name: 'Ventas',
  //   href: '/admin/sales',
  //   icon: IconCashRegister,
  // },
  {
    name: 'Personal Operativo',
    href: '/admin/users',
    icon: IconUsersGroup,
  },
  {
    name: 'Configuración',
    href: '/admin/settings',
    icon: IconSettings,
  },
];
