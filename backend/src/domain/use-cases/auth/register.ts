import { AccessCodeState, UserRole } from '@/generated/enums';

import { AccessCodeRepository } from '@/domain/repositories/access-code.repository';
import { AuthRepository } from '@/domain/repositories/auth.repository';

import { AuthResponse } from '@/domain/dtos/auth/auth-response.dto';
import { RegisterDtoType } from '@/domain/dtos/auth/register.dto';

import { BadRequestException } from '@/shared/exceptions/bad-request';
import { JwtService } from '@/shared/auth/jwt.service';
import { messages } from '@/shared/messages';
import { UserEntity } from '@/domain/entities/user.entity';

interface RegisterUseCase {
  execute(dto: RegisterDtoType): Promise<AuthResponse>;
}

export class Register implements RegisterUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly accessCodeRepository: AccessCodeRepository
  ) {}

  async execute(dto: RegisterDtoType): Promise<AuthResponse> {
    const existingEmail = await this.authRepository.findByEmail(dto.email);

    if (existingEmail) {
      throw new BadRequestException(
        messages.auth.emailAlreadyExists(dto.email)
      );
    }

    const existingUsername = await this.authRepository.findByUsername(
      dto.username
    );
    if (existingUsername) {
      throw new BadRequestException(
        messages.auth.usernameAlreadyExists(dto.username)
      );
    }

    // el primer usuario será admin
    const isFirstUser = await this.authRepository.isFirstUser();
    let userRole: UserRole = isFirstUser ? UserRole.admin : UserRole.customer;

    if (!isFirstUser && dto.accessCode) {
      const accessCode = await this.accessCodeRepository.findActiveByCode(
        dto.accessCode
      );

      if (!accessCode) {
        throw new BadRequestException(messages.auth.invalidAccessCode());
      }

      const now = new Date();
      if (accessCode.expiresAt && accessCode.expiresAt < now) {
        await this.accessCodeRepository.updateState(
          accessCode.id,
          AccessCodeState.expired,
          now
        );
        throw new BadRequestException(messages.accessCode.expired());
      }

      userRole = this.mapAccessCodeRoleToUserRole(accessCode.role);

      await this.accessCodeRepository.updateState(
        accessCode.id,
        AccessCodeState.used,
        now
      );
    }

    const user = await this.authRepository.register(dto, userRole);

    const { accessToken, refreshToken } = JwtService.generateTokenPair(user);

    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword as UserEntity,
      token: accessToken,
      refreshToken,
    };
  }

  private mapAccessCodeRoleToUserRole(accessCodeRole: string): UserRole {
    const roleMap: Record<string, UserRole> = {
      admin: UserRole.admin,
      cashier: UserRole.cashier,
      delivery: UserRole.delivery,
    };

    return roleMap[accessCodeRole] || UserRole.customer;
  }
}
