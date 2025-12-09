import { CreateCodeDtoType } from '@/domain/dtos/access-codes/create-code.dto';
import { AccessCodeEntity } from '@/domain/entities/access-code.entity';
import { AccessCodeRepository } from '@/domain/repositories/access-code.repository';

export interface CreateAccessCodeUseCase {
  execute(dto: CreateCodeDtoType): Promise<AccessCodeEntity>;
}

export class CreateAccessCode implements CreateAccessCodeUseCase {
  constructor(private readonly repository: AccessCodeRepository) {}

  async execute(dto: CreateCodeDtoType): Promise<AccessCodeEntity> {
    const code = this.generateUniqueCode();
    const expiresAt = this.calculateExpirationDate();

    const existingCode = await this.repository.findActiveByCode(code);
    if (existingCode) {
      return this.execute(dto);
    }

    return this.repository.createCode({
      ...dto,
      code,
      expiresAt,
    });
  }

  private generateUniqueCode(): string {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
  }

  private calculateExpirationDate(): Date {
    const now = new Date();
    const expirationDate = new Date(now.getTime() + 30 * 60 * 1000);
    return expirationDate;
  }
}
