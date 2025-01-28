import { defineConfig } from 'vite';

export default defineConfig({
   base: '/', // Repository name
  build: {
    chunkSizeWarningLimit: 1000, // Optional: adjust chunk size warning
  },
});
