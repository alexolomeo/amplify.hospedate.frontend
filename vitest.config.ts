import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    exclude: ['tests'],
    include: ['src/**/*.test.ts'],
    alias: {
      'astro:transitions/client': path.resolve(
        __dirname,
        'src/__mocks__/astroClientNavigate.ts'
      ),
    },
  },
});
