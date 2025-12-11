'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Icon } from '@tabler/icons-react';

import Logo from '../Logo';
import NavLink from './NavLink';
import TriggerProfileCard from './TriggerProfileCard';

export type NavItem = {
  name: string;
  href: string;
  icon: Icon;
};

const Sidebar = ({ navItems }: { navItems: NavItem[] }) => {
  return (
    <aside className="max-w-60 h-full w-full mx-auto flex flex-col justify-between overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <Link href="/admin/home" className="block">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Logo width="100%" height="100%" />
          </motion.div>
        </Link>
      </motion.div>
      <nav className="flex flex-col h-full justify-between">
        <ul className="flex flex-col justify-center">
          {navItems.map(({ href, name, icon }, index) => {
            return (
              <NavLink
                key={index}
                href={href}
                name={name}
                icon={icon}
                index={index}
              />
            );
          })}
        </ul>

        <TriggerProfileCard />
      </nav>
    </aside>
  );
};

export default Sidebar;
