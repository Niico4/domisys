import { ChangePasswordDtoType } from '@/domain/dtos/user/change-password.dto';
import { UserRepository } from '@/domain/repositories/user.repository';

export interface ChangePasswordUseCase {
  execute(userId: number, dto: ChangePasswordDtoType): Promise<void>;
}

export class ChangePassword implements ChangePasswordUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: number, dto: ChangePasswordDtoType): Promise<void> {
    await this.userRepository.changePassword(userId, dto);
  }
}
