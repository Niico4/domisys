import { Card, CardBody, Chip } from '@heroui/react';
import { ReactNode } from 'react';

interface DashboardSectionProps {
  title: string;
  badge?: {
    label: string | number;
    color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  };
  children: ReactNode;
  emptyMessage?: string;
}

export const DashboardSection = ({
  title,
  badge,
  children,
  emptyMessage,
}: DashboardSectionProps) => {
  return (
    <Card className="border-none bg-default-50">
      <CardBody className="gap-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{title}</h2>
          {badge && (
            <Chip size="sm" variant="flat" color={badge.color || 'default'}>
              {badge.label}
            </Chip>
          )}
        </div>
        {emptyMessage ? (
          <p className="py-8 text-center text-sm text-default-400">
            {emptyMessage}
          </p>
        ) : (
          children
        )}
      </CardBody>
    </Card>
  );
};
