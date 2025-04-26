import { lazy } from 'react';
import { IconHome, IconUser, IconHistory } from '@tabler/icons-react';

import { RoleRouterType } from './role-router.type';

import { paths } from '@/constants/routerPaths';

const HomePage = lazy(() => import('@/pages/delivery'));
const HistoryPage = lazy(() => import('@/pages/delivery/History'));
const ProfilePage = lazy(() => import('@/pages/Profile'));

export const deliveryRoutes: RoleRouterType[] = [
  {
    path: paths.home,
    icon: IconHome,
    label: 'Inicio',
    element: <HomePage />,
  },
  {
    path: paths.history,
    icon: IconHistory,
    label: 'Historial',
    element: <HistoryPage />,
  },
  {
    path: paths.profile,
    icon: IconUser,
    label: 'Perfil',
    element: <ProfilePage />,
  },
];
