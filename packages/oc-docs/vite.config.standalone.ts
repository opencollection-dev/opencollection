import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
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
  plugins: [
    react()
  ],
  define: {
    'process.env.NODE_ENV': '"production"'
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/standalone.ts'),
      name: 'OpenCollectionPlayground',
      fileName: (format) => format === 'umd' ? 'index.js' : 'index.esm.js',
      formats: ['umd', 'es']
    },
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        // Bundle everything into a single file
        inlineDynamicImports: true,
        manualChunks: undefined,
        globals: {},
        exports: 'named',
        // Ensure CSS is extracted properly
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'index.css';
          }
          return assetInfo.name || 'asset';
        }
      }
    },
    outDir: 'dist-standalone',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  css: {
    postcss: './postcss.config.cjs'
  }
}); 