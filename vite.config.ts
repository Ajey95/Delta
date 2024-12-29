import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        ws: true,
        configure: (proxy, _options) => {
          // Listen for proxy errors
          proxy.on('error', (err, _req, _res) => {
            console.log('Proxy error:', err);
          });

          // Modify the outgoing proxy request
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
            // Example: Add a custom header
            proxyReq.setHeader('X-Custom-Header', 'CustomValue');
          });

          // Log the response from the backend
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },
});
