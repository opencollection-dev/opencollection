import { defineConfig } from 'vite';
import { resolve } from 'path';

// Custom plugin to wrap the entire output
function wrapInFunction() {
  return {
    name: 'wrap-in-function',
    generateBundle(options: any, bundle: any) {
      for (const fileName in bundle) {
        const chunk = bundle[fileName];
        if (chunk.type === 'chunk') {
          // Wrap the entire code in getBundledCode function
          chunk.code = `const getBundledCode = () => { return function(){
${chunk.code}
}(); }; export { getBundledCode };`;
        }
      }
    }
  };
}

// Vite config for bundling libraries similar to bundle-libraries.js
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
  build: {
    lib: {
      entry: resolve(__dirname, 'src/scripting/sandbox/quickjs/bundle-entry.ts'),
      name: 'LibraryBundle',
      fileName: 'bundled-libraries',
      formats: ['iife']
    },
    rollupOptions: {
      output: {
        format: 'iife',
        name: 'LibraryBundle'
      },
      plugins: [wrapInFunction()]
    },
    outDir: 'src/scripting/sandbox/quickjs',
    emptyOutDir: false,
  },
  define: {
    global: 'globalThis'
  }
});
