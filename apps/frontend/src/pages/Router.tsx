import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';

import SignInPage from './auth/SignIn';
import SignUpPage from './auth/SignUp';
import RecoverPasswordPage from './auth/RecoverPassword';
import HomePage from './customer/Home';
import ShoppingCartPage from './customer/ShoppingCart';
import OrdersPage from './customer/Orders';
import ProfilePage from './customer/Profile';

import { paths } from '@/constants/routerPaths';
import Layout from '@/components/layout/Layout';

export default function AppRouter() {
  return <RouterProvider router={router} />;
}

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path={paths.authRoot}>
        <Route path={paths.signIn} element={<SignInPage />} />
        <Route path={paths.signUp} element={<SignUpPage />} />
        <Route path={paths.recoverPassword} element={<RecoverPasswordPage />} />
      </Route>

      <Route path="/" element={<Layout />}>
        <Route path={paths.home} element={<HomePage />} />
        <Route path={paths.shoppingCart} element={<ShoppingCartPage />} />
        <Route path={paths.orders} element={<OrdersPage />} />
        <Route path={paths.profile} element={<ProfilePage />} />
      </Route>
    </>,
  ),
);
