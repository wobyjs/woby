import { defineConfig } from 'vite';
import path from 'path';
import dts from 'vite-plugin-dts';

const config = defineConfig({
    build: {
        minify: false,
        lib: {
            entry: ["./src/index.ts", "./src/jsx/runtime.ts",  "./src/ssr/ssr-runtime.ts", "./src/via/via-runtime.ts",
                './src/ssr.ts',  './src/via.ts', './src/testing.ts'],
            name: 'woby',
            formats: ['cjs', 'es'],
            fileName: (format: string, entryName: string) => `${entryName}.${format}.js`
        },
        sourcemap: true,
    },
    esbuild: {
        jsx: 'automatic',
    },
    plugins: [
        dts({ entryRoot: './src', outputDir: './dist/types' })
    ],
    resolve: {
        alias: {
            '~': path.resolve(__dirname, 'src'),
        },
    },
});



export default config;
