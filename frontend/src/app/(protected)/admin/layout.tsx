'use client';
import Sidebar from '@/components/shared/sidebar/Sidebar';
import { adminNavItems } from './navbar.routes';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-dvh w-dvw bg-surface-alt grid grid-cols-[220px_1fr] px-6 py-5 gap-6">
      <Sidebar navItems={adminNavItems} />
      <section className="bg-surface-main rounded-xl overflow-x-auto shadow-md p-10">
        {children}
      </section>
    </main>
  );
}
