import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api/esp1': {
        target: 'http://192.168.1.100',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/esp1/, '')
      },
      '/api/esp2': {
        target: 'http://192.168.1.200',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/esp2/, '')
      }
    }
  }
})
