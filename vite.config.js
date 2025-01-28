import { defineConfig } from 'vite';

export default defineConfig({
  base: '/Delta/', // Repository name
  build: {
    chunkSizeWarningLimit: 1000, // Optional: adjust chunk size warning
  },
});
