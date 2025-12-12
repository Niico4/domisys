'use client';

import { Input } from '@heroui/react';
import { IconSearch } from '@tabler/icons-react';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: () => void;
  className?: string;
}

export const SearchBar = ({
  placeholder = 'Buscar producto...',
  value,
  onChange,
  onSearch,
  className = '',
}: SearchBarProps) => {
  return (
    <Input
      type="text"
      placeholder={placeholder}
      value={value}
      onValueChange={onChange}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && onSearch) {
          onSearch();
        }
      }}
      startContent={
        <IconSearch
          className="text-default-400"
          size={20}
          stroke={1.5}
        />
      }
      classNames={{
        base: 'w-full',
        input: 'text-sm sm:text-base',
        inputWrapper:
          'bg-default-100 hover:bg-default-200 border-none shadow-none',
      }}
      className={className}
    />
  );
};

