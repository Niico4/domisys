import { UserEntity } from '@/domain/entities/user.entity';
import { UserRepository } from '@/domain/repositories/user.repository';

import { UpdateProfileDtoType } from '@/domain/dtos/user/update-profile.dto';

import { BadRequestException } from '@/shared/exceptions/bad-request';
import { messages } from '@/shared/messages';

export class UpdateProfile {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    userId: number,
    dto: UpdateProfileDtoType
  ): Promise<UserEntity> {
    const currentUser = await this.userRepository.findById(userId);

    if (!currentUser) {
      throw new BadRequestException(messages.user.notFound());
    }

    const hasChanges =
      (dto.name && dto.name !== currentUser.name) ||
      (dto.lastName && dto.lastName !== currentUser.lastName) ||
      (dto.phoneNumber && dto.phoneNumber !== currentUser.phoneNumber);

    if (!hasChanges) {
      throw new BadRequestException(messages.user.noChangesDetected());
    }

    return await this.userRepository.updateProfile(userId, dto);
  }
}
