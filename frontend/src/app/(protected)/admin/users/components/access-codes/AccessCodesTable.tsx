'use client';

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@heroui/table';
import { Chip } from '@heroui/chip';
import { Button } from '@heroui/button';
import { Tooltip } from '@heroui/tooltip';
import { IconTrash } from '@tabler/icons-react';
import {
  AccessCode,
  AccessCodeState,
  AccessCodeRole,
} from '@/types/user-management/access-code';

interface AccessCodesTableProps {
  codes: AccessCode[];
  isLoading: boolean;
  onDisable: (code: AccessCode) => void;
}

const columns = [
  { key: 'code', label: 'Código' },
  { key: 'role', label: 'Rol' },
  { key: 'status', label: 'Estado' },
  { key: 'expiresAt', label: 'Expira' },
  { key: 'actions', label: 'Acciones' },
];

const roleLabels: Record<AccessCodeRole, string> = {
  [AccessCodeRole.admin]: 'Administrador',
  [AccessCodeRole.delivery]: 'Repartidor',
  [AccessCodeRole.cashier]: 'Cajero',
};

const statusColors: Record<
  AccessCodeState,
  'success' | 'secondary' | 'danger' | 'warning'
> = {
  [AccessCodeState.active]: 'success',
  [AccessCodeState.disabled]: 'danger',
  [AccessCodeState.expired]: 'warning',
  [AccessCodeState.used]: 'secondary',
};

const statusLabels: Record<AccessCodeState, string> = {
  [AccessCodeState.active]: 'Activo',
  [AccessCodeState.disabled]: 'Inactivo',
  [AccessCodeState.expired]: 'Expirado',
  [AccessCodeState.used]: 'Usado',
};

export default function AccessCodesTable({
  codes,
  isLoading,
  onDisable,
}: AccessCodesTableProps) {
  const renderCell = (code: AccessCode, columnKey: React.Key) => {
    switch (columnKey) {
      case 'code':
        return (
          <div className="flex flex-col">
            <span className="font-mono font-semibold text-lg">
              {code.code}
            </span>
            <span className="text-xs text-default-400">
              Creado el {new Date(code.createdAt).toLocaleDateString()}
            </span>
          </div>
        );
      case 'role':
        return (
          <Chip color="primary" size="sm" variant="flat">
            {roleLabels[code.role]}
          </Chip>
        );
      case 'status':
        return (
          <Chip color={statusColors[code.status]} size="sm" variant="flat">
            {statusLabels[code.status]}
          </Chip>
        );
      case 'expiresAt':
        return (
          <div className="flex flex-col">
            <span className="text-sm">
              {code.expiresAt
                ? new Date(code.expiresAt).toLocaleDateString()
                : 'Sin expiración'}
            </span>
            {code.expiresAt && code.status === AccessCodeState.active && (
              <span className="text-xs text-default-400">
                {new Date(code.expiresAt) > new Date()
                  ? `Expira en ${Math.ceil(
                      (new Date(code.expiresAt).getTime() - new Date().getTime()) /
                        (1000 * 60 * 60 * 24)
                    )} días`
                  : 'Expirado'}
              </span>
            )}
          </div>
        );
      case 'actions':
        return (
          <div className="flex gap-2">
            <Tooltip content="Desactivar código" color="danger">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                color="danger"
                onPress={() => onDisable(code)}
                isDisabled={code.status !== AccessCodeState.active}
              >
                <IconTrash size={18} />
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Table aria-label="Tabla de códigos de acceso">
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody
        items={codes}
        isLoading={isLoading}
        emptyContent="No hay códigos de acceso"
      >
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
