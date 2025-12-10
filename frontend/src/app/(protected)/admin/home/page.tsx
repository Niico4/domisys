'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@heroui/react';

const AdminHomePage = () => {
  const { logout, user } = useAuth();

  return (
    <div>
      <h1>
        Welcome, {user?.name} con rol {user?.role}
      </h1>

      <div>AdminHomePage</div>
      <Button onPress={logout}>Cerrar sesión</Button>
    </div>
  );
};

export default AdminHomePage;
