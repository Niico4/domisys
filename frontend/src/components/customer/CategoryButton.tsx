'use client';

import { Button } from '@heroui/react';
import { Icon as TablerIcon } from '@tabler/icons-react';

interface CategoryButtonProps {
  icon: React.ComponentType<{ size?: number; stroke?: number; className?: string }>;
  label: string;
  onClick?: () => void;
}

export const CategoryButton = ({ icon: Icon, label, onClick }: CategoryButtonProps) => {
  return (
    <div className="flex flex-col items-center gap-2 w-20 sm:w-24">
      <Button
        isIconOnly
        className="w-16 h-16 sm:w-20 sm:h-20 bg-secondary-50 hover:bg-secondary-100 rounded-2xl transition-colors flex-shrink-0"
        onPress={onClick}
        aria-label={label}
      >
        <Icon size={32} stroke={1.5} className="text-secondary-600" />
      </Button>
      <span className="text-xs sm:text-sm text-secondary-600 font-medium text-center leading-tight break-words w-full px-1">
        {label}
      </span>
    </div>
  );
};
