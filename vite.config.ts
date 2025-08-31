import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          workbox: ['workbox-precaching', 'workbox-routing', 'workbox-strategies'],
          dexie: ['dexie'],
        },
      },
    },
  },
  server: {
    port: 3000,
  },
});