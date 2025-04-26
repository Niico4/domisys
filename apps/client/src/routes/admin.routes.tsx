import { lazy } from 'react';
import { IconHome, IconUser } from '@tabler/icons-react';

import { RoleRouterType } from './role-router.type';

import { paths } from '@/constants/routerPaths';

const ProfilePage = lazy(() => import('@/pages/Profile'));

export const adminRoutes: RoleRouterType[] = [
  {
    path: paths.home,
    icon: IconHome,
    label: 'Inicio',
    element: <h1>Home page admin</h1>,
  },
  {
    path: paths.profile,
    icon: IconUser,
    label: 'Perfil',
    element: <ProfilePage />,
  },
];
