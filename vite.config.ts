import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: 'src/renderer',
  plugins: [react()],
  build: {
    outDir: '../../dist',
    emptyOutDir: true,
    rollupOptions: {
      external: ['jsdom', 'pngjs', 'node:buffer'],
    },
  },
  resolve: {
    alias: {
      '@common': path.resolve(__dirname, 'src/common'),
      '@renderer': path.resolve(__dirname, 'src/renderer'),
    },
  },
  optimizeDeps: {
    exclude: ['jsdom', 'pngjs'],
  },
  server: {
    port: 5173,
  },
});
