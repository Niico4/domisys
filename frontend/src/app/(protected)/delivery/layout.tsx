'use client';

import { IconHome, IconClock, IconUser } from '@tabler/icons-react';
import { BottomNav, NavItem } from '@/components/shared/bottom-nav/BottomNav';
import { CartBottomSheet } from '@/components/customer/CartBottomSheet';

const navItems: NavItem[] = [
  { href: '/delivery/home', icon: IconHome, label: 'Inicio' },
  { href: '/delivery/history', icon: IconClock, label: 'Historial' },
  { icon: IconUser, label: 'Perfil', isProfile: true },
];

export default function DeliveryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="min-h-screen pb-20 sm:pb-24 bg-surface-main">
        {children}
      </div>
      <BottomNav navItems={navItems} />
      <CartBottomSheet />
    </>
  );
}
