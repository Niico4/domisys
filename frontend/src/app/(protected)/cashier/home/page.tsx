'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@heroui/react';

const CashierHomePage = () => {
  const { logout, user } = useAuth();

  return (
    <div>
      <h1>
        Welcome, {user?.name} con rol {user?.role}
      </h1>

      <div>CashierHomePage</div>
      <Button onPress={logout}>Cerrar sesión</Button>
    </div>
  );
};

export default CashierHomePage;
