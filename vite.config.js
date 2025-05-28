// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteImagemin from 'vite-plugin-imagemin';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    // Adicionar o plugin visualizer para analisar o tamanho do bundle
    process.env.ANALYZE === 'true' && visualizer({
      filename: './dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
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
    // chunkSizeWarningLimit: 1500, // Aumentar o limite de aviso para 1.5MB
    target: 'esnext', // Usar sintaxe moderna para reduzir tamanho
    minify: 'terser', // Usar terser para minificação mais agressiva
    terserOptions: {
      compress: {
        drop_console: true, // Remover console.logs
        drop_debugger: true, // Remover debuggers
        passes: 2 // Múltiplos passes para maior compressão
      },
      mangle: {
        toplevel: true // Mangle também funções e variáveis de nível superior
      }
    },
    reportCompressedSize: false, // Desativa relatório de tamanho comprimido para acelerar o build
    rollupOptions: {
      input: 'index.html', // Usar o index.html da raiz
      output: {
        // Quebrar o CSS em arquivos separados
        assetFileNames: 'assets/[name]-[hash][extname]',
        // Garantir que os chunks de código tenham nomes previsíveis
        chunkFileNames: 'assets/[name]-[hash].js',
        // Garantir que o arquivo principal tenha um nome previsível
        entryFileNames: 'assets/[name]-[hash].js',
        manualChunks: (id) => {
          // React core - dividido em partes menores para evitar exceder limites de tamanho
          if (id.includes('node_modules/react/jsx-runtime') ||
             id.includes('node_modules/react/jsx-dev-runtime')) {
            return 'react-jsx';
          }
          if (id.includes('node_modules/react')) {
            return 'react-core';
          }

          // React DOM - separado para reduzir tamanho
          if (id.includes('node_modules/react-dom')) {
            return 'react-dom';
          }

          // Scheduler (usado pelo React)
          if (id.includes('node_modules/scheduler')) {
            return 'scheduler';
          }

          // React Icons - dividido por pacotes específicos
          if (id.includes('node_modules/react-icons/fi')) {
            return 'react-icons-fi';
          }
          if (id.includes('node_modules/react-icons/bs')) {
            return 'react-icons-bs';
          }
          if (id.includes('node_modules/react-icons/md')) {
            return 'react-icons-md';
          }
          if (id.includes('node_modules/react-icons')) {
            return 'react-icons-other';
          }

          // Highlight.js - separar base e linguagens
          if (id.includes('node_modules/highlight.js/lib/core')) {
            return 'highlight-core';
          }
          if (id.includes('node_modules/highlight.js/lib/languages')) {
            return 'highlight-languages';
          }
          if (id.includes('node_modules/highlight.js/styles')) {
            return 'highlight-styles';
          }

          // React Markdown e dependências
          if (id.includes('node_modules/react-markdown')) {
            return 'react-markdown';
          }
          // Dividir processadores de markdown em chunks menores
          if (id.includes('node_modules/remark')) {
            return 'markdown-remark';
          }
          if (id.includes('node_modules/rehype')) {
            return 'markdown-rehype';
          }
          if (id.includes('node_modules/unified')) {
            return 'markdown-unified';
          }
          if (id.includes('node_modules/unist') || id.includes('node_modules/micromark')) {
            return 'markdown-misc';
          }

          // Tailwind e utilitários CSS
          if (id.includes('node_modules/tailwindcss') ||
             id.includes('node_modules/postcss') ||
             id.includes('node_modules/autoprefixer')) {
            return 'tailwind-utils';
          }

          // Utilitários e bibliotecas comuns
          if (id.includes('node_modules/lodash') ||
             id.includes('node_modules/underscore')) {
            return 'utils-lodash';
          }

          // Bibliotecas de data/hora
          if (id.includes('node_modules/date-fns') ||
             id.includes('node_modules/dayjs') ||
             id.includes('node_modules/moment')) {
            return 'date-time-libs';
          }

          // Bibliotecas de estado
          if (id.includes('node_modules/redux') ||
             id.includes('node_modules/zustand') ||
             id.includes('node_modules/recoil')) {
            return 'state-management';
          }

          // Outras bibliotecas de UI
          if (id.includes('node_modules/@headlessui') ||
             id.includes('node_modules/@radix-ui')) {
            return 'ui-libraries';
          }

          // Outros módulos de node_modules divididos por prefixo alfabético
          // A-G
          if (id.includes('node_modules/a') || id.includes('node_modules/b') ||
             id.includes('node_modules/c') || id.includes('node_modules/d') ||
             id.includes('node_modules/e') || id.includes('node_modules/f') ||
             id.includes('node_modules/g')) {
            return 'vendor-a-g';
          }
          // H-N
          if (id.includes('node_modules/h') || id.includes('node_modules/i') ||
             id.includes('node_modules/j') || id.includes('node_modules/k') ||
             id.includes('node_modules/l') || id.includes('node_modules/m') ||
             id.includes('node_modules/n')) {
            return 'vendor-h-n';
          }
          // O-T
          if (id.includes('node_modules/o') || id.includes('node_modules/p') ||
             id.includes('node_modules/q') || id.includes('node_modules/r') ||
             id.includes('node_modules/s') || id.includes('node_modules/t')) {
            return 'vendor-o-t';
          }
          // U-Z
          if (id.includes('node_modules/u') || id.includes('node_modules/v') ||
             id.includes('node_modules/w') || id.includes('node_modules/x') ||
             id.includes('node_modules/y') || id.includes('node_modules/z') ||
             id.includes('node_modules/@')) {
            return 'vendor-u-z';
          }

          // Qualquer outro módulo de node_modules
          if (id.includes('node_modules')) {
            return 'vendor-misc';
          }
        }
      }
    },
  },
  base: '/'
});
