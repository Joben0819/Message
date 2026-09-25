import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),basicSsl()],
  
server: {
    host: '0.0.0.0',
    port: 5173,

    allowedHosts: [
      'edmund-peaceful-elliot.ngrok-free.dev',
    ],

    proxy: {
      '/api': {
        target: 'https://192.168.254.108:3001',
        changeOrigin: true,
      },

      '/socket': {
        target: 'ws://192.168.254.108:8080',
        ws: true,
      },
    },
  },
})
