
/* IMPORT */

import path from 'node:path'
import process from 'node:process'
import { defineConfig } from 'vite'

/* MAIN */

const config = defineConfig({
    resolve: {
        alias: {
            '~': path.resolve('../../src'),
            'woby/jsx-dev-runtime': process.argv.includes('dev') ? path.resolve('../../../woby/src/jsx/runtime') : 'woby',
            'woby/jsx-runtime': process.argv.includes('dev') ? path.resolve('../../../woby/src/jsx/runtime') : 'woby',
            'woby': process.argv.includes('dev') ? path.resolve('../../../woby/src') : 'woby'
        }
    }
})

/* EXPORT */

export default config
