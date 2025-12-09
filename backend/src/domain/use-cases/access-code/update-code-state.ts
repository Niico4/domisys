import { AccessCodeState } from '@/generated/enums';

import { AccessCodeEntity } from '@/domain/entities/access-code.entity';
import { AccessCodeRepository } from '@/domain/repositories/access-code.repository';

import { BadRequestException } from '@/shared/exceptions/bad-request';
import { messages } from '@/shared/messages';

export interface UpdateCodeStateUseCase {
  execute(codeId: number, state: AccessCodeState): Promise<AccessCodeEntity>;
}

export class UpdateCodeState implements UpdateCodeStateUseCase {
  constructor(private readonly repository: AccessCodeRepository) {}

  async execute(
    codeId: number,
    state: AccessCodeState
  ): Promise<AccessCodeEntity> {
    const code = await this.repository.findById(codeId);

    if (code.status === state) {
      throw new BadRequestException(messages.accessCode.cannotDisable(state));
    }

    if (code.status === AccessCodeState.used) {
      throw new BadRequestException(messages.accessCode.alreadyUsed());
    }

    if (code.status === AccessCodeState.expired) {
      throw new BadRequestException(messages.accessCode.expired());
    }

    if (code.status === AccessCodeState.disabled) {
      throw new BadRequestException(messages.accessCode.alreadyDisabled());
    }

    if (
      state === AccessCodeState.disabled &&
      code.status !== AccessCodeState.active
    ) {
      throw new BadRequestException(
        messages.accessCode.cannotDisableNonActive()
      );
    }

    if (state === AccessCodeState.used) {
      throw new BadRequestException(
        // `El estado 'used' no puede ser asignado manualmente`
        messages.accessCode.cannotSetManually(state)
      );
    }

    if (state === AccessCodeState.expired) {
      throw new BadRequestException(
        messages.accessCode.cannotSetManually(state)
      );
    }

    const now = new Date();
    return this.repository.updateState(codeId, state, now);
  }
}
