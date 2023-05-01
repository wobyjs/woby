import { defineConfig } from 'vite';
import path from 'path';


const config = defineConfig({
    build: {
        minify: false,
        lib: {
            entry: ["./src/index.ts", "./src/jsx/jsx-runtime.ts", "./src/ssr/ssr-runtime.ts", "./src/via/via-runtime.ts",
                './src/ssr.ts', './src/via.ts', './src/testing.ts'],
            name: "oby",
            formats: ['cjs', 'es'],
            fileName: (format: string, entryName: string) => `${entryName}.${format}.js`
        },
        sourcemap: true,
    },
    esbuild: {
        jsx: 'automatic',
    },
    plugins: [
    ],
    resolve: {
        alias: {
            '~': path.resolve(__dirname, 'src'),
        },
    },
});



export default config;
