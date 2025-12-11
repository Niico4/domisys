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
import { IconMail, IconLogout } from '@tabler/icons-react';
import { motion } from 'framer-motion';

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
              {user?.role}
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

const TriggerProfileCard = () => {
  const { user } = useAuth();
  return (
    <Popover showArrow placement="top">
      <PopoverTrigger>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut', delay: 0.15 }}
        >
          <Button
            className="w-full justify-start gap-3 p-3 h-auto"
            variant="flat"
            color="secondary"
            as={motion.button}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Avatar size="sm" color="primary" />
            <div className="flex flex-col items-start flex-1 min-w-0 text-left gap-0.5">
              <p className="text-sm font-semibold text-default-900 truncate w-full">
                {user?.name} {user?.lastName}
              </p>
              <p className="text-xs text-neutral-600 capitalize truncate w-full">
                {user?.role}
              </p>
            </div>
          </Button>
        </motion.div>
      </PopoverTrigger>
      <PopoverContent className="p-3">
        <ProfileCard />
      </PopoverContent>
    </Popover>
  );
};

export default TriggerProfileCard;
