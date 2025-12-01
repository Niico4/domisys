import { PrismaClient, UserRole } from '@/generated/client';

import { BadRequestException } from '@/shared/exceptions/bad-request';

export class UserRoleService {
  constructor(private readonly prisma: PrismaClient) {}

  async validateUserRole(id: number, expectedRole: UserRole) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { role: true },
    });

    if (!user) {
      throw new BadRequestException(`El usuario ${id} no existe.`);
    }

    if (user.role !== expectedRole) {
      throw new BadRequestException(
        `El usuario ${id} no tiene rol de ${expectedRole}.`
      );
    }
  }
}
