import cron from 'node-cron';

import { accessCodeRepositoryImplementation } from '@/infrastructure/repositories/access-code.repository.impl';
import { accessCodeDatasourceImplementation } from '@/infrastructure/datasource/access-code.datasource.impl';

import { ExpireAccessCodesService } from '@/shared/services/expire-access-codes.service';

export const startCronJobs = () => {
  const accessCodeRepo = accessCodeRepositoryImplementation(
    accessCodeDatasourceImplementation
  );

  const expireCodesService = new ExpireAccessCodesService(accessCodeRepo);

  cron.schedule('*/10 * * * *', async () => {
    try {
      const count = await expireCodesService.expireOldCodes();
      if (count > 0) {
        console.log(`[CRON] ${count} códigos de acceso expirados actualizados`);
      }
    } catch (error) {
      console.error('[CRON] Error al expirar códigos:', error);
    }
  });

  console.log(
    '[CRON] Cron jobs iniciados - Verificación de códigos cada 5 min'
  );
};
