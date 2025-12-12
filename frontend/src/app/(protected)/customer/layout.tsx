'use client';

import { BottomNav } from '@/components/customer/BottomNav';
import { CartBottomSheet } from '@/components/customer/CartBottomSheet';

export default function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="min-h-screen bg-background pb-20 sm:pb-24">
        {children}
      </div>
      <BottomNav />
      <CartBottomSheet />
    </>
  );
}

