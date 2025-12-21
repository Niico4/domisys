import { UserRepository } from '@/domain/repositories/user.repository';
import { UserEntity } from '@/domain/entities/user.entity';

export interface GetAllCashiersUseCase {
  execute(): Promise<UserEntity[]>;
}

export class GetAllCashiers implements GetAllCashiersUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(): Promise<UserEntity[]> {
    return await this.userRepository.findAllCashiers();
  }
}
