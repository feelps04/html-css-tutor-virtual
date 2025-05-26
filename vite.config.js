import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// [https://vitejs.dev/config/](https://vitejs.dev/config/)
export default defineConfig({
  plugins: [react()],
  // Mantenha a base como '/' para que os caminhos como /assets/ funcionem
  base: '/',
  build: {
    outDir: 'dist', // Isso cria a pasta 'dist' dentro de 'vite-project'
  },
  server: {
    proxy: {
      // Proxy para o backend Flask durante o desenvolvimento local
      '/api': {
        target: '[http://127.0.0.1:5000](http://127.0.0.1:5000)', // URL do seu backend Flask
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
