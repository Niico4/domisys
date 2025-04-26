import { lazy } from 'react';
import {
  IconHome,
  IconShoppingCart,
  IconBoxSeam,
  IconUser,
} from '@tabler/icons-react';

import { RoleRouterType } from './role-router.type';

import { paths } from '@/constants/routerPaths';

const HomePage = lazy(() => import('@/pages/customer'));
const ShoppingCartPage = lazy(() => import('@/pages/customer/ShoppingCart'));
const OrdersPage = lazy(() => import('@/pages/customer/Orders'));
const ProfilePage = lazy(() => import('@/pages/Profile'));

export const customerRoutes: RoleRouterType[] = [
  {
    path: paths.home,
    icon: IconHome,
    label: 'Inicio',
    element: <HomePage />,
  },
  {
    path: paths.shoppingCart,
    icon: IconShoppingCart,
    label: 'Carrito',
    badge: true,
    element: <ShoppingCartPage />,
  },
  {
    path: paths.orders,
    icon: IconBoxSeam,
    label: 'Pedidos',
    element: <OrdersPage />,
  },
  {
    path: paths.profile,
    icon: IconUser,
    label: 'Perfil',
    element: <ProfilePage />,
  },
];
