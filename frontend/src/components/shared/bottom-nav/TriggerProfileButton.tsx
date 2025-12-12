'use client';
import { useAuth } from '@/hooks/useAuth';
import {
  Card,
  CardHeader,
  Avatar,
  CardBody,
  CardFooter,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@heroui/react';
import { IconMail, IconLogout, IconUser } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

const roleConfig: Record<
  string,
  {
    label: string;
  }
> = {
  customer: { label: 'Cliente' },
  admin: { label: 'Administrador' },
  delivery: { label: 'Repartidor' },
  cashier: { label: 'Cajero' },
};

const ProfileCard = () => {
  const { user, logout } = useAuth();
  return (
    <Card className="max-w-[280px] border-none bg-transparent" shadow="none">
      <CardHeader className="flex-col items-center gap-2 pb-3">
        <Avatar size="lg" color="primary" />
        <div className="flex flex-col items-center gap-0.5 text-center">
          <h4 className="text-base font-bold text-default-900">
            {user?.name} {user?.lastName}
          </h4>
          <div className="flex items-center gap-1.5">
            <p className="text-xs text-default-400">@{user?.username}</p>
            <span className="w-1 h-1 rounded-full bg-default-300" />
            <span className="text-xs font-medium text-primary-600 capitalize">
              {user?.role ? roleConfig[user.role]?.label || user.role : ''}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardBody className="gap-2.5 py-3 border-t border-default-100">
        <div className="flex items-center gap-2">
          <IconMail
            stroke={1.5}
            className="text-default-400 shrink-0"
            size={16}
          />
          <div className="flex flex-col gap-0">
            <span className="text-[10px] text-default-400 uppercase tracking-wide">
              Email
            </span>
            <p className="text-xs text-default-700">{user?.email}</p>
          </div>
        </div>

        {user?.phoneNumber && (
          <div className="flex items-center gap-2">
            <IconMail
              stroke={1.5}
              className="text-default-400 shrink-0"
              size={16}
            />
            <div className="flex flex-col gap-0">
              <span className="text-[10px] text-default-400 uppercase tracking-wide">
                Teléfono
              </span>
              <p className="text-xs text-default-700">{user?.phoneNumber}</p>
            </div>
          </div>
        )}
      </CardBody>

      <CardFooter className="pt-3 border-t border-default-100">
        <Button
          color="danger"
          variant="flat"
          size="sm"
          fullWidth
          startContent={<IconLogout stroke={1.5} size={16} />}
          onPress={logout}
          className="font-medium"
        >
          Cerrar sesión
        </Button>
      </CardFooter>
    </Card>
  );
};

export const TriggerProfileButton = () => {
  const pathname = usePathname();
  const isActive = pathname === '/delivery/profile';

  return (
    <Popover showArrow placement="top">
      <PopoverTrigger>
        <button
          className="flex-1 flex flex-col items-center justify-center gap-1 relative"
          aria-label="Perfil"
        >
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
                <IconUser size={24} stroke={2} />
              </motion.div>
            ) : (
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
                <IconUser size={22} stroke={1.5} />
              </div>
            )}
          </motion.div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="p-3">
        <ProfileCard />
      </PopoverContent>
    </Popover>
  );
};
