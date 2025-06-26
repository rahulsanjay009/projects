import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({command}) =>({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  base: command === 'build'? '/' : '/',
  build: {
    outDir: 'dist',
    target: 'esnext',
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  }
}));
