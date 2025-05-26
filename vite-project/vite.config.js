import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: './', // Define a pasta vite-project como o root do projeto Vite
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'public/index.html', // ESTA LINHA É CRÍTICA!
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  base: '/'
});