import bcrypt from 'bcrypt';

import { prisma } from '@/data/postgresql';
import { UserRole } from '@/generated/enums';

import { UserEntity } from '@/domain/entities/user.entity';
import { AuthDatasource } from '@/domain/datasources/auth.datasource';

import { LoginDtoType } from '@/domain/dtos/auth/login.dto';
import { RegisterDtoType } from '@/domain/dtos/auth/register.dto';

import { BadRequestException } from '@/shared/exceptions/bad-request';
import { UnauthorizedException } from '@/shared/exceptions/unauthorized';
import { EmailService } from '@/shared/services/email.service';
import { messages } from '@/shared/messages';

export const authDatasourceImplementation: AuthDatasource = {
  async register(dto: RegisterDtoType, role: UserRole): Promise<UserEntity> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await prisma.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        name: dto.name,
        lastName: dto.lastName,
        phoneNumber: dto.phoneNumber,
        password: hashedPassword,
        role,
      },
    });

    EmailService.sendWelcomeEmail(user.email, user.name, role).catch(
      (error) => {
        console.error('[REGISTER] Error enviando email de bienvenida:', error);
      }
    );

    return user;
  },

  async login(dto: LoginDtoType): Promise<UserEntity> {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: dto.emailOrUsername }, { username: dto.emailOrUsername }],
      },
    });

    if (!user) {
      throw new UnauthorizedException(messages.auth.invalidCredentials());
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException(messages.auth.incorrectPassword());
    }

    return user;
  },

  async findByEmail(email: string): Promise<UserEntity | null> {
    return await prisma.user.findUnique({ where: { email } });
  },

  async findByUsername(username: string): Promise<UserEntity | null> {
    return await prisma.user.findUnique({ where: { username } });
  },

  async findByEmailOrUsername(
    emailOrUsername: string
  ): Promise<UserEntity | null> {
    return await prisma.user.findFirst({
      where: {
        OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
      },
    });
  },

  async findById(id: number): Promise<UserEntity> {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new BadRequestException(messages.user.notFound());
    }

    return user;
  },

  async isFirstUser(): Promise<boolean> {
    const count = await prisma.user.count();
    return count === 0;
  },
};
