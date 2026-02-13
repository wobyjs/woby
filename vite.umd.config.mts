import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import path from 'path'

// Check if we're in watch mode
const isWatchMode = process.env.WATCH === 'true' || process.argv.includes('--watch')

const config = defineConfig({
    build: {
        minify: false,
        lib: {
            entry: "./src/index.ts",
            name: 'woby',
            formats: ['umd'],
            fileName: (format) => `index.${format}.js`
        },
        sourcemap: true,
        rollupOptions: {
            external: [],
            output: {
                globals: {
                    // Define globals for any external dependencies if needed
                }
            }
        },
        // Prevent Vite from clearing the output directory only in watch mode
        emptyOutDir: false
    },
    esbuild: {
        jsx: 'automatic',
    },
    plugins: [
        nodePolyfills({
            // To exclude specific polyfills, add them to this list.
            exclude: ['net'],
            // Whether to polyfill specific globals.
            globals: {
                Buffer: true, // can also be 'build', 'dev', or false
                global: true,
                process: true,
            },
            // Whether to polyfill `node:` protocol imports.
            protocolImports: true
        })
    ],
    resolve: {
        alias: {
            '~': path.resolve(__dirname, 'src'),
            // Fix for stream/web import
            'stream/web': 'web-streams-polyfill/dist/ponyfill.mjs',
            // Polyfills for Node.js modules that happy-dom needs
            'net': path.resolve(__dirname, 'net-polyfill.js'),
            'node:perf_hooks': path.resolve(__dirname, 'perf_hooks-polyfill.js')
        },
    },
    define: {
        // Provide polyfills for Node.js globals that happy-dom might need
        global: 'globalThis',
    },
})

export default config