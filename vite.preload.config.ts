import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    outDir: 'dist-electron',
    emptyOutDir: false,
    lib: {
      entry: [path.resolve('src/main/main.ts'), path.resolve('src/main/preload.ts')],
      formats: ['cjs'],
    },
    rollupOptions: {
      external: [
        'electron',
        'path',
        'fs',
        'fs/promises',
        'crypto',
        'url',
        'util',
      ],
      output: {
        entryFileNames: '[name].js',
      },
    },
    target: 'node20',
  },
});
