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
    isolate: true,
    // Unit tests live in src/ as *.test.ts(x). The e2e/ specs are Playwright
    // tests (run via `npm run test:e2e`) and must not be collected by Vitest.
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist', 'dist-standalone', 'e2e/**']
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

