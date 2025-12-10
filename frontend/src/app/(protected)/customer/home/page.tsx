'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@heroui/react';

const CustomerHomePage = () => {
  const { logout, user } = useAuth();

  return (
    <div>
      <h1>
        Welcome, {user?.name} con rol {user?.role}
      </h1>

      <div>CustomerHomePage</div>
      <Button onPress={logout}>Cerrar sesión</Button>
    </div>
  );
};

export default CustomerHomePage;
