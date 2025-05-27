import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: './', // Onde o Vite considera a raiz do seu projeto (vite-project/)
  build: {
    outDir: 'dist', // A pasta de saída para os arquivos compilados
    rollupOptions: {
      // CORREÇÃO ESSENCIAL: Aponta para o index.html diretamente na raiz de 'vite-project/'
      input: 'index.html', 
    },
  },
  // 'base' define o caminho base para servir os ativos (importante para deploy)
  base: '/'
});
