import { Icon } from '@tabler/icons-react';

export type RouteDefinition = {
  path: string;
  element: React.ReactNode;
};

export interface RoleRouterType extends RouteDefinition {
  label: string;
  icon: Icon;
  badge?: boolean;
}
