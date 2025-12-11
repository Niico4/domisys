'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { Icon } from '@tabler/icons-react';

interface NavLinkProps {
  href: string;
  name: string;
  icon: Icon;
  index: number;
}

const NavLink = ({ href, name, icon: Icon, index }: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <motion.li
      key={href}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: index * 0.02,
        duration: 0.15,
        ease: 'easeOut',
      }}
    >
      <Link href={href} className="relative block">
        <motion.div
          className={`flex items-center justify-start gap-3 p-4 rounded-xl ${
            isActive
              ? 'text-primary-50 font-medium'
              : 'text-neutral-700 hover:text-neutral-900'
          }`}
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          transition={{
            duration: 0.1,
            ease: 'linear',
          }}
        >
          {isActive && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-primary-500 rounded-xl"
              initial={false}
              transition={{
                type: 'tween',
                duration: 0.2,
                ease: 'easeInOut',
              }}
            />
          )}

          <Icon stroke={1.5} className="relative z-10" />
          <p className="relative z-10">{name}</p>
        </motion.div>
      </Link>
    </motion.li>
  );
};

export default NavLink;
