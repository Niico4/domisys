'use client';

import { useAuth } from '@/hooks/useAuth';

export const Greeting = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <h1 className="text-xl sm:text-2xl font-bold text-default-900">
        ¡Hola {user?.name}!
      </h1>
      <p className="text-sm sm:text-base text-default-500">
        {user?.role !== 'delivery'
          ? '¿Qué se te antoja hoy?'
          : '¿Listo para entregar?'}
      </p>
    </div>
  );
};
