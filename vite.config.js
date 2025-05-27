// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    port: 3000, // Set the development server port to 3000
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
      input: 'public/index.html', // O index.html está dentro da pasta public/
      output: {
        manualChunks: {
          // Split React and React DOM into a separate chunk
          'react-vendor': ['react', 'react-dom'],
          
          // Split other UI-related dependencies
          'ui-vendor': ['react-icons'],
          
          // Create a chunk for markdown/code highlighting
          'markdown-vendor': ['react-markdown', 'highlight.js'],
          
          // Create a chunk for utility libraries if you have any
          'utils-vendor': [] // Add utility libraries here if you have any
        }
      }
    },
  },
  base: '/'
});