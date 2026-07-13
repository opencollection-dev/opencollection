import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin']
      }
    })
  ],
  resolve: {
    alias: {
      '@slices': resolve(__dirname, 'src/store/slices'),
      '@store': resolve(__dirname, 'src/store'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@components': resolve(__dirname, 'src/components'),
      '@ui': resolve(__dirname, 'src/ui'),
      '@constants': resolve(__dirname, 'src/constants'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@runner': resolve(__dirname, 'src/runner')
    }
  },
  server: {
    port: 3001,
    host: '127.0.0.1', // Use IPv4 to avoid permission issues
    open: true,
    fs: {
      allow: ['../..']
    },
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    }
  },
  css: {
    postcss: './postcss.config.cjs'
  },
  define: {
    'process.env.NODE_ENV': '"development"'
  },
  assetsInclude: ['**/*.wasm'],
  optimizeDeps: {
    exclude: ['quickjs-emscripten']
  }
});
