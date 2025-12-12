'use client';

import { useAuth } from '@/hooks/useAuth';

export const Greeting = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-xl sm:text-2xl font-bold text-default-900">
        ¡Hola {user?.name}!
      </h1>
      <p className="text-sm sm:text-base text-default-500">
        ¿Qué se te antoja hoy?
      </p>
    </div>
  );
};

