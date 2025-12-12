'use client';

import { Button, Badge } from '@heroui/react';
import { IconBell } from '@tabler/icons-react';
import { motion } from 'framer-motion';

interface NotificationButtonProps {
  notificationCount?: number;
  onClick?: () => void;
  className?: string;
}

export const NotificationButton = ({
  notificationCount = 0,
  onClick,
  className = '',
}: NotificationButtonProps) => {
  const hasNotifications = notificationCount > 0;

  return (
    <Badge
      content={hasNotifications ? notificationCount : null}
      color="danger"
      size="sm"
      isInvisible={!hasNotifications}
      classNames={{
        base: 'cursor-pointer',
      }}
    >
      <Button
        isIconOnly
        variant="flat"
        className={`bg-default-100 hover:bg-default-200 min-w-unit-10 w-unit-10 h-unit-10 ${className}`}
        onPress={onClick}
        as={motion.button}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <IconBell
          className="text-primary-600"
          size={20}
          stroke={1.5}
        />
      </Button>
    </Badge>
  );
};

