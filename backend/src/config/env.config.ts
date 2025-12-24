import { config } from 'dotenv';
import z from 'zod';

config();

const envSchema = z.object({
  PORT: z.string({ error: 'PORT es obligatorio' }).transform(Number),
  NODE_ENV: z.enum(['development', 'production'], {
    error: 'NODE_ENV debe ser development o production',
  }),

  POSTGRES_URL: z.url({ error: 'POSTGRES_URL debe ser una URL válida' }),
  POSTGRES_USER: z.string({ error: 'POSTGRES_USER es requerido' }),
  POSTGRES_PASSWORD: z.string({ error: 'POSTGRES_PASSWORD es requerido' }),
  POSTGRES_DB: z.string({ error: 'POSTGRES_DB es requerido' }),

  JWT_SECRET: z.string({ error: 'JWT_SECRET es requerido' }),
  JWT_REFRESH_SECRET: z.string({ error: 'JWT_REFRESH_SECRET es requerido' }),

  EMAIL_USER: z.email({ error: 'EMAIL_USER debe ser un email válido' }),
  EMAIL_PASSWORD: z.string({ error: 'EMAIL_PASSWORD es requerido' }),
  EMAIL_FROM: z.string({ error: 'EMAIL_FROM es obligatorio' }),

  FRONT_END_URL: z.url({ error: 'FRONT_END_URL debe ser una URL válida' }),
});

const validateEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Error en variables de entorno:');
      error.issues.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
};

export const {
  PORT,
  NODE_ENV,

  POSTGRES_URL,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,

  JWT_SECRET,
  JWT_REFRESH_SECRET,

  EMAIL_USER,
  EMAIL_PASSWORD,
  EMAIL_FROM,

  FRONT_END_URL,
} = validateEnv();
