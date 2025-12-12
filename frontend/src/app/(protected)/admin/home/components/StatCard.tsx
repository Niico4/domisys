import { Card, CardBody, Chip } from '@heroui/react';
import { IconTrendingUp, type Icon } from '@tabler/icons-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: Icon;
  color: 'primary' | 'warning' | 'success' | 'secondary';
  bgColor: string;
  iconColor: string;
  description: string;
}

export const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
  iconColor,
  description,
}: StatCardProps) => {
  return (
    <Card className="border-none bg-linear-to-br from-default-50 to-default-100">
      <CardBody className="gap-4 p-6">
        <div className="flex items-start justify-between">
          <div className={`rounded-xl ${bgColor} p-3 shadow-sm`}>
            <Icon className={iconColor} size={28} strokeWidth={2} />
          </div>
          <Chip
            color={color}
            variant="flat"
            size="sm"
            className="font-semibold"
          >
            <IconTrendingUp size={14} />
          </Chip>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-default-600">{title}</p>
          <p className="text-4xl font-bold tracking-tight">{value}</p>
          <p className="text-xs text-default-500">{description}</p>
        </div>
      </CardBody>
    </Card>
  );
};
