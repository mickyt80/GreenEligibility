import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Unit tests only. The dev server settings stay in vite.config.js.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.js'],
    include: ['test/**/*.test.{js,jsx}'],
  },
});
