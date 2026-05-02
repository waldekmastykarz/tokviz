import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: 'src/client',
  build: {
    outDir: '../../dist/client',
    emptyOutDir: true,
  },
  server: {
    open: true,
    hmr: {
      path: '/__hmr',
    },
    proxy: {
      '/v1': 'http://localhost:4318',
    },
  },
});
