import { Pool } from 'pg';
import { PrismaClient } from '@/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';

import { POSTGRES_URL } from '@/config/env.config';

const pool = new Pool({ connectionString: POSTGRES_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter, log: ['error'] });

export { prisma };
