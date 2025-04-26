import { motion, useScroll, useTransform } from 'framer-motion';

import ItemNavbar from './ItemNavbar';

import Brand from '@/components/common/Brand';
import useAuth from '@/hooks/useAuth';
import { deliveryRoutes, customerRoutes, adminRoutes } from '@/routes';
import { UserRole } from '@/store/useAuth.store';

const Navbar = () => {
  const { scrollY } = useScroll();
  const { user } = useAuth();

  const routes =
    user?.role === UserRole.DELIVERY
      ? deliveryRoutes
      : user?.role === UserRole.ADMIN
        ? adminRoutes
        : customerRoutes;

  // Animaciones controladas por scroll
  const headerHeight = useTransform(scrollY, [0, 100], [80, 60]);
  const logoScale = useTransform(scrollY, [0, 100], [1, 0.9]);
  const bgOpacity = useTransform(scrollY, [0, 100], [0, 0.6]);
  const navItemY = useTransform(scrollY, [0, 100], [0, -2]);

  const appUrl =
    import.meta.env.MODE === 'development'
      ? import.meta.env.VITE_APP_URL_DEV
      : import.meta.env.VITE_APP_URL_PROD;

  return (
    <motion.header
      style={{
        height: headerHeight,
        backgroundColor: useTransform(bgOpacity, (v) => `rgba(0, 0, 0, ${v})`),
        backdropFilter: useTransform(bgOpacity, (v) => `blur(${v * 12}px)`),
      }}
      className="w-full flex items-center fixed top-0 z-50"
    >
      <nav className="flex justify-between items-center w-4/5 mx-auto h-full p-4">
        {/* Logo con animación de escala */}
        <motion.div style={{ scale: logoScale }}>
          <a href={appUrl} aria-label="volver al inicio">
            <Brand />
          </a>
        </motion.div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex-center gap-3 text-xl">
          {routes.map(({ icon, path, label, badge }, index) => (
            <motion.li key={index} style={{ y: navItemY }}>
              <ItemNavbar href={path} icon={icon} label={label} badge={badge} />
            </motion.li>
          ))}
        </ul>
      </nav>
    </motion.header>
  );
};

export default Navbar;
