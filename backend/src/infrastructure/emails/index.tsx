import { render } from '@react-email/render';
import { UserRole } from '@/generated/enums';

import WelcomeEmail from './templates/welcome';

export const renderEmail = {
  welcome: async (name: string, role: UserRole) => {
    return await render(<WelcomeEmail name={name} role={role} />);
  },
};
