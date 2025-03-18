import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000,
    host: '0.0.0.0',
    proxy: {
      '/users': {
        target: 'http://localhost:3000', // Your backend URL
        changeOrigin: true,
      },
      '/admin': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        ws: true,
        xfwd: true,
        
        },
      '/events': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/auth': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/adminAuth': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/hobbies': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/likes': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/comments': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/notifications': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/public': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
});
