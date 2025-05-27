// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Aponta para a porta do seu backend Flask
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove o '/api' do path antes de enviar para o backend
      },
    },
  },
  root: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'index.html', // Ou 'public/index.html' se o seu index.html estiver dentro da pasta public/
    },
  },
  base: '/'
});