'use client';

import { HeroUIProvider as HeroUI } from '@heroui/react';

export function HeroUIProvider({ children }: { children: React.ReactNode }) {
  return <HeroUI>{children}</HeroUI>;
}
