import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import path from 'path'
// import dts from 'vite-plugin-dts'

// Check if we're in watch mode
const isWatchMode = process.env.WATCH === 'true' || process.argv.includes('--watch')

const config = defineConfig({
    build: {
        minify: false,
        lib: {
            entry: {
                index: "./src/index.ts",
                runtime: "./src/jsx/runtime.ts",
                "ssr-runtime": "./src/ssr/ssr-runtime.ts",
                "via-runtime": "./src/via/via-runtime.ts",
                ssr: './src/ssr.ts',
                via: './src/via.ts',
                testing: './src/testing.ts',
                "jsx-runtime-ssr": './src/ssr/jsx-runtime/index.ts'
            },
            name: 'woby',
            formats: ['cjs', 'es'],
            fileName: (format: string, entryName: string) => `${entryName}.${format}.js`
        },
        sourcemap: true,
        rollupOptions: {
            external: []
        },
        // Prevent Vite from clearing the output directory only in watch mode
        emptyOutDir: !isWatchMode
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
        }),
        // dts({ entryRoot: './src', outputDir: './dist/types' })
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
    ssr: {
        // Don't externalize happy-dom for SSR builds
        noExternal: ['happy-dom']
    }
})

export default config