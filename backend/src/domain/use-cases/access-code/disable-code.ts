import { AccessCodeState } from '@/generated/enums';
import { AccessCodeEntity } from '@/domain/entities/access-code.entity';
import { AccessCodeRepository } from '@/domain/repositories/access-code.repository';

import { BadRequestException } from '@/shared/exceptions/bad-request';
import { messages } from '@/shared/messages';

export interface DisableCodeUseCase {
  execute(codeId: number, adminId: number): Promise<AccessCodeEntity>;
}

export class DisableCode implements DisableCodeUseCase {
  constructor(private readonly repository: AccessCodeRepository) {}

  async execute(codeId: number, adminId: number): Promise<AccessCodeEntity> {
    const code = await this.repository.findById(codeId);

    if (code.status === AccessCodeState.disabled) {
      throw new BadRequestException(messages.accessCode.alreadyDisabled());
    }

    if (code.status !== AccessCodeState.active) {
      throw new BadRequestException(
        messages.accessCode.cannotDisableNonActive()
      );
    }

    return await this.repository.disableCode(codeId, adminId);
  }
}
