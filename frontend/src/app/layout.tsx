import type { Metadata } from 'next';
import { Mochiy_Pop_One, Inter } from 'next/font/google';

import { HeroUIProvider } from '@/components/providers/HeroUIProvider';
import { AuthInitializer } from '@/components/providers/AuthInitializer';
import { AxiosProvider } from '@/components/providers/AxiosProvider';
import './globals.css';

const mochiyPopOne = Mochiy_Pop_One({
  variable: '--font-mochiy-pop-one',
  weight: '400',
  subsets: ['latin'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'DomiSys',
  description:
    'Sistema de gestión integral para tu negocio. Controla inventario, procesa pedidos y coordina entregas en tiempo real. Simple, rápido y eficiente.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${mochiyPopOne.variable} ${inter.variable} antialiased custom-theme`}
      >
        <HeroUIProvider>
          <AxiosProvider>
            <AuthInitializer>{children}</AuthInitializer>
          </AxiosProvider>
        </HeroUIProvider>
      </body>
    </html>
  );
}
