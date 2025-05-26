import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: './', // Adiciona ou ajusta esta linha
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'index.html', // Adiciona ou ajusta esta linha (ou 'public/index.html' se for o caso)
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