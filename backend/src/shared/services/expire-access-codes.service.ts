import { AccessCodeState } from '@/generated/enums';
import { AccessCodeRepository } from '@/domain/repositories/access-code.repository';

export class ExpireAccessCodesService {
  constructor(private readonly repository: AccessCodeRepository) {}

  async expireOldCodes(): Promise<number> {
    const now = new Date();
    const allCodes = await this.repository.getAll();

    let expiredCount = 0;

    for (const code of allCodes) {
      if (
        code.status === AccessCodeState.active &&
        code.expiresAt &&
        code.expiresAt < now
      ) {
        await this.repository.updateState(
          code.id,
          AccessCodeState.expired,
          now
        );
        expiredCount++;
      }
    }

    return expiredCount;
  }
}
