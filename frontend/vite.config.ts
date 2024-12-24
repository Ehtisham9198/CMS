import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Alias for cleaner imports
    },
  },
  build: {
    outDir: 'dist', // Ensure Vite outputs to the correct directory
    sourcemap: true, // Useful for debugging in production
  },
  server: {
    port: 5173, // Optional: Match your local development port
  },
  preview: {
    port: 4173, // Optional: Port for vite preview in production simulation
  },
});
