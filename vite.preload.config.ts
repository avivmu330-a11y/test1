import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    outDir: 'dist-electron',
    emptyOutDir: false,
    lib: {
      entry: [path.resolve(__dirname, 'src/main/main.ts'), path.resolve(__dirname, 'src/main/preload.ts')],
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
