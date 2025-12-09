import { UserRole } from '@/generated/enums';

import { UserEntity } from '@/domain/entities/user.entity';

import { LoginDtoType } from '@/domain/dtos/auth/login.dto';
import { RegisterDtoType } from '@/domain/dtos/auth/register.dto';

export interface AuthDatasource {
  register(dto: RegisterDtoType, role: UserRole): Promise<UserEntity>;
  login(dto: LoginDtoType): Promise<UserEntity>;

  findByEmail(email: string): Promise<UserEntity | null>;
  findByUsername(username: string): Promise<UserEntity | null>;
  findByEmailOrUsername(emailOrUsername: string): Promise<UserEntity | null>;
  findById(id: number): Promise<UserEntity>;
  isFirstUser(): Promise<boolean>;

  // forgotPassword(dto: ForgotPasswordDtoType): Promise<string>;
  // resetPassword(dto: ResetPasswordDtoType): Promise<void>;

  // verifyEmail(dto: VerifyEmailDtoType): Promise<void>;
  // resendVerificationEmail(email: string): Promise<string>;
}
