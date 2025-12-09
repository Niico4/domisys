import { UserEntity } from '@/domain/entities/user.entity';
import { AuthRepository } from '@/domain/repositories/auth.repository';

import { AuthResponse } from '@/domain/dtos/auth/auth-response.dto';
import { LoginDtoType } from '@/domain/dtos/auth/login.dto';

import { JwtService } from '@/shared/auth/jwt.service';

interface LoginUseCase {
  execute(dto: LoginDtoType): Promise<AuthResponse>;
}

export class Login implements LoginUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(dto: LoginDtoType): Promise<AuthResponse> {
    const user = await this.authRepository.login(dto);

    const { accessToken, refreshToken } = JwtService.generateTokenPair(user);

    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword as UserEntity,
      token: accessToken,
      refreshToken,
    };
  }
}
