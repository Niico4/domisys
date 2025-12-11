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
import { Avatar } from '@heroui/avatar';
import { User } from '@/types/user';

interface UsersTableProps {
  users: User[];
  isLoading: boolean;
}

const columns = [
  { key: 'user', label: 'Usuario' },
  { key: 'contact', label: 'Contacto' },
  { key: 'role', label: 'Rol' },
  { key: 'createdAt', label: 'Fecha de registro' },
];

const roleConfig: Record<
  string,
  {
    label: string;
    color:
      | 'success'
      | 'secondary'
      | 'danger'
      | 'warning'
      | 'primary'
      | 'default'
      | undefined;
  }
> = {
  admin: { label: 'Administrador', color: 'primary' },
  delivery: { label: 'Repartidor', color: 'success' },
  cashier: { label: 'Cajero', color: 'warning' },
};

export default function UsersTable({ users, isLoading }: UsersTableProps) {
  const renderCell = (user: User, columnKey: React.Key) => {
    switch (columnKey) {
      case 'user':
        return (
          <div className="flex items-center gap-3">
            <Avatar
              name={`${user.name} ${user.lastName}`}
              size="sm"
              color="primary"
              className="shrink-0"
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold">
                {user.name} {user.lastName}
              </span>
              <span className="text-xs text-default-500">@{user.username}</span>
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="flex flex-col">
            <span className="text-sm">{user.email}</span>
            <span className="text-xs text-default-500">
              {user.phoneNumber || 'Sin teléfono'}
            </span>
          </div>
        );
      case 'role':
        const config = roleConfig[user.role];
        return (
          <Chip color={config?.color || 'default'} size="sm" variant="flat">
            {config?.label || user.role}
          </Chip>
        );
      case 'createdAt':
        return (
          <span className="text-sm text-default-600">
            {new Date(user.createdAt).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <Table aria-label="Tabla de usuarios">
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody
        items={users}
        isLoading={isLoading}
        emptyContent="No hay usuarios registrados"
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
