'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IconHome,
  IconSearch,
  IconShoppingCart,
  IconClock,
  IconUser,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/cart.store';

interface NavItem {
  href?: string;
  icon: typeof IconHome;
  label: string;
  isCart?: boolean;
}

const navItems: NavItem[] = [
  { href: '/customer/home', icon: IconHome, label: 'Inicio' },
  { href: '/customer/search', icon: IconSearch, label: 'Buscar' },
  { icon: IconShoppingCart, label: 'Carrito', isCart: true },
  { href: '/customer/history', icon: IconClock, label: 'Historial' },
  { href: '/customer/profile', icon: IconUser, label: 'Perfil' },
];

export const BottomNav = () => {
  const pathname = usePathname();
  const { isCartOpen, openCart } = useCartStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-default-200 shadow-lg safe-area-inset-bottom">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-around h-16 sm:h-20">
          {navItems.map((item, index) => {
            const isActive = item.isCart
              ? isCartOpen
              : pathname === item.href;
            const Icon = item.icon;

            const content = (
              <motion.div
                className={`flex flex-col items-center justify-center gap-1 ${
                  isActive ? 'text-white' : 'text-default-500'
                }`}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.1 }}
              >
                {isActive ? (
                  <motion.div
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary-600 flex items-center justify-center"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 20,
                    }}
                  >
                    <Icon size={24} stroke={2} />
                  </motion.div>
                ) : (
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
                    <Icon size={22} stroke={1.5} />
                  </div>
                )}
              </motion.div>
            );

            if (item.isCart) {
              return (
                <button
                  key="cart"
                  onClick={openCart}
                  className="flex-1 flex flex-col items-center justify-center gap-1 relative"
                  aria-label="Abrir carrito"
                >
                  {content}
                </button>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href!}
                className="flex-1 flex flex-col items-center justify-center gap-1 relative"
              >
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

