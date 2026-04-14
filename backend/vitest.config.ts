import { configDefaults, defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    coverage: {
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        ...(configDefaults.coverage.exclude ?? []),
        'src/generated/**',
        'node_modules/**',
        'dist/**',
      ],
    },
    exclude: [...configDefaults.exclude, 'dist', 'node_modules'],
    include: [...configDefaults.include, './test/**/*.{test,spec}.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@core': path.resolve(__dirname, './src/core'),
      '@modules': path.resolve(__dirname, './src/modules'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@config': path.resolve(__dirname, './src/config'),
      '@data': path.resolve(__dirname, './src/data'),
      '@generated': path.resolve(__dirname, './src/generated'),
    },
  },
});
