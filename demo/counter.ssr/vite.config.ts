import { defineConfig } from 'vite'

export default defineConfig({
  define: {
    // Define process.platform for Happy DOM environment
    '__process.platform': JSON.stringify('win32'),
    'process.platform': JSON.stringify('win32'),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  },
  server: {
    // Configure for SSR development
    middlewareMode: false
  },
  build: {
    rollupOptions: {
      external: []
    }
  },
  // Ensure polyfills are loaded
  optimizeDeps: {
    exclude: ['woby']
  }
})