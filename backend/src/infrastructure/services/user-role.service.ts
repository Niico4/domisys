import { PrismaClient, UserRole } from '@/generated/client';

import { BadRequestException } from '@/shared/exceptions/bad-request';
import { messages } from '@/shared/messages';

export class UserRoleService {
  constructor(private readonly prisma: PrismaClient) {}

  async validateUserRole(id: number, expectedRole: UserRole) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { role: true },
    });

    if (!user) {
      throw new BadRequestException(messages.user.notFoundWithId(id));
    }

    if (user.role !== expectedRole) {
      throw new BadRequestException(
        messages.user.doesNotHaveRole(id, expectedRole)
      );
    }
  }
}
