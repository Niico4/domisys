import { Navigate, Outlet, useLocation } from 'react-router-dom';

import Spinner from '../../components/common/Spinner';

import { paths } from '@/constants/routerPaths';
import { UserRole } from '@/store/useAuth.store';
import useAuth from '@/hooks/useAuth';
import { roleRedirectMap } from '@/constants/role-redirect-map';

type Props = {
  children?: React.ReactNode;
  allowedRoles: UserRole[];
};

export default function ProtectedRoute({ allowedRoles, children }: Props) {
  const location = useLocation();
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen grid place-content-center">
        <div className="flex-col-center gap-4">
          <Spinner />
          <span className="text-gray-light/75 text-xl">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to={`/${paths.authRoot}/${paths.signIn}`}
        state={{ from: location }}
        replace
      />
    );
  }

  if (user.role && !allowedRoles.includes(user.role)) {
    const homePath = roleRedirectMap[user.role];

    return <Navigate to={homePath} replace />;
  }

  return children ?? <Outlet />;
}
