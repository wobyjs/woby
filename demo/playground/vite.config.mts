
/* IMPORT */

import path from 'node:path'
import process from 'node:process'
import { defineConfig } from 'vite'

/* MAIN */

const config = defineConfig({
    server: {
        port: 5276,
        strictPort: true,
        hmr: {
            protocol: 'ws',
            host: 'localhost',
            port: 5276
        },
        watch: {
            // Watch the woby source directory for HMR
            ignored: [
                // Ignore node_modules and dist folders, but NOT the woby src
                '**/node_modules/**/!(woby)/**',
                '**/dist/**'
            ]
        }
    },
    esbuild: {
        jsx: 'automatic',
        jsxImportSource: 'woby',
    },
    resolve: {
        alias: {
            '~': path.resolve('../../src'),
            // CRITICAL: Force all woby imports to resolve to src, not dist
            'woby/jsx-dev-runtime': path.resolve('../../src/jsx/runtime'),
            'woby/jsx-runtime': path.resolve('../../src/jsx/runtime'),
            'woby': path.resolve('../../src')
        },
        // Ensure .ts and .tsx files are resolved
        extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json']
    },
    // Ensure Vite watches the source directory for HMR
    optimizeDeps: {
        // Don't optimize the woby package - always use source files
        exclude: ['woby']
    },
    // Enable sourcemaps for debugging
    build: {
        sourcemap: true
    }
})

/* EXPORT */

export default config
