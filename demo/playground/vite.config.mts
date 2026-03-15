
/* IMPORT */

import path from 'node:path'
import process from 'node:process'
import { defineConfig } from 'vite'

/* MAIN */

// Get port from command line args or environment variable or default
const getPortFromArgs = () => {
    const portArg = process.argv.find(arg => arg.startsWith('--port='))
    if (portArg) {
        return parseInt(portArg.split('=')[1], 10)
    }
    return parseInt(process.env.PORT || '5276', 10)
}

const port = getPortFromArgs()

const config = defineConfig({
    server: {
        port: port,
        strictPort: false, // Allow Vite to find an available port if specified port is taken
        host: true, // Required for --host flag
        hmr: {
            protocol: 'ws',
            host: 'localhost',
            port: parseInt(process.env.HMR_PORT || String(port), 10)
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
