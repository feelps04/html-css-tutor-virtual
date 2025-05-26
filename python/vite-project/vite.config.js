import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Mantenha a base como '/' para que os caminhos como /assets/ funcionem
  base: '/',
  build: {
    outDir: 'dist', // Isso cria a pasta 'dist' dentro de 'vite-project'
  }
})
