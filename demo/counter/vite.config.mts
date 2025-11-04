import path from 'node:path'
import process from 'node:process'
import { defineConfig } from 'vite'

console.log(process.argv)

// Only set aliases in dev mode
const isDev = process.argv.includes('dev')

const config = defineConfig({
    resolve: {
        alias: isDev ? {
            '~': path.resolve('../../src'),
            'woby/jsx-runtime': path.resolve('../../../woby/src/jsx/runtime'),
            'woby': path.resolve('../../../woby/src')
        } : {
            '~': path.resolve('../../src'),
            // In build mode, resolve to the actual package
            'woby/jsx-runtime': path.resolve('../../../woby/src/jsx/runtime'),
            'woby': path.resolve('../../../woby/src')
        }
    }
})

export default config