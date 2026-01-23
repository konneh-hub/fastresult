import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios']
  },
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: true
  },
  build: {
    rollupOptions: {
      input: {
        main: '/index.html'
      }
    }
  }
});
