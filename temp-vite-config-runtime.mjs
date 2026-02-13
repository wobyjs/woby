
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import path from 'path'

const config = defineConfig({
  build: {
    outDir: './dist/debug',
    minify: false,
    sourcemap: true,
    rollupOptions: {
      input: './src/jsx/runtime.ts',
      output: {
        format: 'es',
        entryFileNames: 'runtime.js',
        chunkFileNames: 'runtime-[name].js',
        assetFileNames: 'runtime-[name].[ext]'
      }
    }
  },
  plugins: [
    nodePolyfills({
      exclude: ['net'],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true
    })
  ],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
      'stream/web': 'web-streams-polyfill/dist/ponyfill.mjs',
      'net': path.resolve(__dirname, 'net-polyfill.js'),
      'node:perf_hooks': path.resolve(__dirname, 'perf_hooks-polyfill.js')
    },
  },
  define: {
    global: 'globalThis',
  }
})

export default config
