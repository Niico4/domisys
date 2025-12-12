'use client';

import { Card, CardBody, Button } from '@heroui/react';
import { IconCheck, IconEdit, IconTrash } from '@tabler/icons-react';

interface AddressCardProps {
  id: number;
  title: string;
  address: string;
  isSelected: boolean;
  onSelect: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const AddressCard = ({
  title,
  address,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: AddressCardProps) => {
  return (
    <Card
      className={`w-full transition-all ${
        isSelected
          ? 'bg-primary-50 border-2 border-primary-500'
          : 'bg-white hover:bg-default-50'
      }`}
    >
      <CardBody className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div 
            className="flex-1 min-w-0 cursor-pointer" 
            onClick={onSelect}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect();
              }
            }}
            tabIndex={0}
            role="button"
            aria-label={`Seleccionar dirección ${title}`}
          >
            <h3 className="font-bold text-default-900 text-base mb-1">
              {title}
            </h3>
            <p className="text-sm text-default-600 leading-relaxed">
              {address}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {isSelected ? (
              <div className="w-6 h-6 bg-primary-600 rounded flex items-center justify-center">
                <IconCheck size={16} className="text-white" stroke={3} />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-default-300" />
            )}
            {onEdit && (
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="min-w-unit-8 w-8 h-8"
                onPress={onEdit}
                aria-label="Editar dirección"
              >
                <IconEdit size={16} className="text-default-600" stroke={2} />
              </Button>
            )}
            {onDelete && (
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="min-w-unit-8 w-8 h-8"
                onPress={onDelete}
                aria-label="Eliminar dirección"
              >
                <IconTrash size={16} className="text-red-600" stroke={2} />
              </Button>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
