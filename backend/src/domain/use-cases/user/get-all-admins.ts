import { UserRepository } from '@/domain/repositories/user.repository';
import { UserEntity } from '@/domain/entities/user.entity';

export interface GetAllAdminsUseCase {
  execute(): Promise<UserEntity[]>;
}

export class GetAllAdmins implements GetAllAdminsUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(): Promise<UserEntity[]> {
    return await this.userRepository.findAllAdmins();
  }
}
