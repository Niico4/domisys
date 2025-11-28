import 'dotenv/config';
import { PrismaClient } from '@/generated/client';

const connectionString = process.env.POSTGRES_URL;

if (!connectionString)
  throw new Error('La variable de entorno no está definida');

export const prisma = new PrismaClient({
  log: ['error', 'info', 'warn'],
  datasources: {
    db: {
      url: connectionString,
    },
  },
});
