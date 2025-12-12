import { Chip } from '@heroui/react';
import type { User } from '@/types/user';
import { UserRole } from '@/types/inventory/enums/user-role';

interface UserListItemProps {
  user: User;
}

export const UserListItem = ({ user }: UserListItemProps) => {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-default-100 p-4 transition-all hover:bg-default-200">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-lg font-semibold text-primary">
        {user.name.charAt(0)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{user.name}</p>
        <p className="truncate text-xs text-default-500">@{user.username}</p>
      </div>
      <Chip
        size="sm"
        color={user.role === UserRole.admin ? 'primary' : 'secondary'}
        variant="flat"
      >
        {user.role}
      </Chip>
    </div>
  );
};
