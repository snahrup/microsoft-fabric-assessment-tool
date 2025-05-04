import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    open: true,
    strictPort: false, // Allow fallback to another port if 3000 is in use
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  // Ensure proper handling of TypeScript and JSX
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
});
