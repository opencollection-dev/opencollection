import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    testTimeout: 30000,
    hookTimeout: 30000,
    teardownTimeout: 10000,
    isolate: true
  },
  resolve: {
    alias: {
      '@slices': resolve(__dirname, 'src/store/slices')
    }
  },
  define: {
    'process.env.NODE_ENV': '"test"'
  }
});

