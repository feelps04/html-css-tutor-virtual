// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteImagemin from 'vite-plugin-imagemin';

export default defineConfig({
  plugins: [
    react(),
    viteImagemin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false,
      },
      optipng: {
        optimizationLevel: 7,
      },
      mozjpeg: {
        quality: 60,
      },
      pngquant: {
        quality: [0.7, 0.8],
        speed: 4,
      },
      svgo: {
        plugins: [
          {
            name: 'removeViewBox',
          },
          {
            name: 'removeEmptyAttrs',
            active: false,
          },
        ],
      },
    }),
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
    chunkSizeWarningLimit: 500, // Set warning limit to 500kb
    rollupOptions: {
      input: 'public/index.html', // O index.html está dentro da pasta public/
      output: {
        manualChunks: (id) => {
          // React core and related libraries
          if (id.includes('node_modules/react') || 
              id.includes('node_modules/react-dom') || 
              id.includes('node_modules/scheduler')) {
            return 'react-vendor';
          }
          
          // UI components and icons
          if (id.includes('node_modules/react-icons')) {
            return 'icons-vendor';
          }
          
          // Markdown and syntax highlighting
          if (id.includes('node_modules/react-markdown') || 
              id.includes('node_modules/highlight.js')) {
            return 'markdown-vendor';
          }
          
          // Other third-party libraries
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    },
  },
  base: '/'
});