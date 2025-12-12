import { Chip } from '@heroui/react';
import type { AccessCode } from '@/types/user-management/access-code';
import { AccessCodeState } from '@/types/user-management/access-code';

interface CodeListItemProps {
  code: AccessCode;
}

export const CodeListItem = ({ code }: CodeListItemProps) => {
  const getStatusColor = () => {
    if (code.status === AccessCodeState.active) return 'success';
    if (code.status === AccessCodeState.used) return 'primary';
    return 'default';
  };

  const getStatusLabel = () => {
    if (code.status === AccessCodeState.active) return 'Disponible';
    if (code.status === AccessCodeState.used) return 'Usado';
    return 'Desactivado';
  };

  return (
    <div className="flex items-center justify-between rounded-lg bg-default-100 p-4 transition-all hover:bg-default-200">
      <div className="flex-1">
        <p className="font-mono font-medium">{code.code}</p>
        <p className="text-xs text-default-500">Rol: {code.role}</p>
      </div>
      <div className="text-right">
        <Chip size="sm" color={getStatusColor()} variant="flat">
          {getStatusLabel()}
        </Chip>
      </div>
    </div>
  );
};
