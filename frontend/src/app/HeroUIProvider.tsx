'use client';

import { HeroUIProvider as HeroUI, ToastProvider } from '@heroui/react';

export function HeroUIProvider({ children }: { children: React.ReactNode }) {
  return (
    <HeroUI>
      <ToastProvider />
      {children}
    </HeroUI>
  );
}
