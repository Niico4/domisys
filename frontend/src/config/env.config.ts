import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.url({
    message: 'NEXT_PUBLIC_API_BASE_URL debe ser una URL válida',
  }),
});

const validateEnv = () => {
  const env = {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  };

  const result = envSchema.safeParse(env);

  if (!result.success) {
    console.error('❌ Error en variables de entorno:');
    result.error.issues.forEach((err) => {
      console.error(`  - ${err.path.join('.')}: ${err.message}`);
    });
    throw new Error('Variables de entorno inválidas');
  }

  return result.data;
};

export const { NEXT_PUBLIC_API_BASE_URL } = validateEnv();
