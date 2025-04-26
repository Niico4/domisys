import { lazy, Suspense, useMemo } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from 'react-router-dom';

import { paths } from '@/constants/routerPaths';
import { adminRoutes, customerRoutes, deliveryRoutes } from '@/routes';
import AppLayout from '@/components/layout/AppLayout';
import ProtectedRoute from '@/routes/components/ProtectedRoute';
import Spinner from '@/components/common/Spinner';
import { UserRole } from '@/store/useAuth.store';
import { RouteDefinition } from '@/routes/role-router.type';

const SignInPage = lazy(() => import('./auth/SignIn'));
const SignUpPage = lazy(() => import('./auth/SignUp'));
const RecoverPasswordPage = lazy(() => import('./auth/RecoverPassword'));

const LoadingFallback = () => (
  <div className="h-screen grid place-content-center">
    <div className="flex-col-center gap-4">
      <Spinner />
      <span className="text-gray-light/75 text-xl">Cargando...</span>
    </div>
  </div>
);

const generateRoutes = (routeArray: RouteDefinition[]) =>
  routeArray.map(({ path, element }, index) => (
    <Route
      key={`${path}-${index}`}
      path={path}
      element={<Suspense fallback={<LoadingFallback />}>{element}</Suspense>}
    />
  ));

export default function AppRouter() {
  const publicRoutes = (
    <Route path={paths.authRoot}>
      <Route index element={<Navigate to={paths.signIn} replace />} />
      <Route path={paths.signIn} element={<SignInPage />} />
      <Route path={paths.signUp} element={<SignUpPage />} />
      <Route path={paths.recoverPassword} element={<RecoverPasswordPage />} />
    </Route>
  );

  const protectedRoutes = (
    routes: RouteDefinition[],
    basePath: string,
    allowedRoles: UserRole[],
  ) => (
    <Route
      path={basePath}
      element={
        <ProtectedRoute allowedRoles={allowedRoles}>
          <AppLayout />
        </ProtectedRoute>
      }
    >
      {generateRoutes(routes)}
    </Route>
  );

  const router = useMemo(
    () =>
      createBrowserRouter(
        createRoutesFromElements(
          <>
            {publicRoutes}
            {protectedRoutes(customerRoutes, paths.root, [UserRole.CUSTOMER])}
            {protectedRoutes(deliveryRoutes, paths.deliveryRoot, [
              UserRole.DELIVERY,
            ])}
            {protectedRoutes(adminRoutes, paths.adminRoot, [UserRole.ADMIN])}

            <Route path="*" element={<h1>Not found</h1>} />
          </>,
        ),
      ),
    [],
  );
  return <RouterProvider router={router} />;
}
