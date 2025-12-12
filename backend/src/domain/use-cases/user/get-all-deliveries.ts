import { UserRepository } from '@/domain/repositories/user.repository';
import { UserEntity } from '@/domain/entities/user.entity';

export interface GetAllDeliveriesUseCase {
  execute(): Promise<UserEntity[]>;
}

export class GetAllDeliveries implements GetAllDeliveriesUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(): Promise<UserEntity[]> {
    return await this.userRepository.findAllDeliveries();
  }
}
