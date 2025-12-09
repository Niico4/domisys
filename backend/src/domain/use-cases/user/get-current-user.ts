import { UserEntity } from '@/domain/entities/user.entity';
import { UserRepository } from '@/domain/repositories/user.repository';

import { BadRequestException } from '@/shared/exceptions/bad-request';
import { messages } from '@/shared/messages';

export class GetCurrentUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: number): Promise<UserEntity> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new BadRequestException(messages.user.notFound());
    }

    return user;
  }
}
