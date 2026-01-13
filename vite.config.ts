import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios']
  },
  server: {
    // listen on all network interfaces so the host name can be used
    host: true,
    port: 5173,
    hmr: {
      host: 'fastresult'
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: '/index.html'
      }
    }
  }
});
