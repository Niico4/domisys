import { PrismaClient } from '@/generated/client';

export class UserRoleService {
  constructor(private readonly prisma: PrismaClient) {}

  async validateUserRole(id: number, expectedRole: 'customer' | 'delivery') {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { role: true },
    });

    if (!user) {
      throw new Error(`El usuario ${id} no existe.`);
    }

    if (user.role !== expectedRole) {
      throw new Error(`El usuario ${id} no tiene rol de ${expectedRole}.`);
    }
  }
}
