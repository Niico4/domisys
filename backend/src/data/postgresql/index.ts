import 'dotenv/config';
import { PrismaClient } from '@/generated/client';

import { BadRequestException } from '@/shared/exceptions/bad-request';

const connectionString = process.env.POSTGRES_URL;

if (!connectionString)
  throw new BadRequestException('La variable de entorno no está definida');

export const prisma = new PrismaClient({
  log: ['error', 'info', 'warn'],
  datasources: {
    db: {
      url: connectionString,
    },
  },
});
