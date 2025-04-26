import { paths } from './routerPaths';

import { UserRole } from '@/store/useAuth.store';

export const roleRedirectMap: Record<UserRole, string> = {
  [UserRole.ADMIN]: `/${paths.adminRoot}/${paths.home}`,
  [UserRole.DELIVERY]: `/${paths.deliveryRoot}/${paths.home}`,
  [UserRole.CUSTOMER]: `${paths.root}${paths.home}`,
};
