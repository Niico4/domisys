'use client';

import { Button } from '@heroui/react';
import { IconFilter } from '@tabler/icons-react';
import { motion } from 'framer-motion';

interface FilterButtonProps {
  onClick?: () => void;
  className?: string;
}

export const FilterButton = ({
  onClick,
  className = '',
}: FilterButtonProps) => {
  return (
    <Button
      isIconOnly
      variant="flat"
      className={`bg-primary-600 hover:bg-primary-700 text-white min-w-unit-10 w-unit-10 h-unit-10 ${className}`}
      onPress={onClick}
      as={motion.button}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <IconFilter size={20} stroke={1.5} />
    </Button>
  );
};

