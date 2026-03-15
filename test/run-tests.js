#!/usr/bin/env node

/**
 * Simple test runner for playground tests
 * Starts dev server, runs Playwright tests, captures logs
 */

import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { platform } from 'os'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT_DIR = join(__dirname, '..')

const PORT = 5276
let devServer = null

console.log('🧪 Starting Playground Test Runner...\n')

// Start dev server
function startDevServer() {
    return new Promise((resolve, reject) => {
        console.log(`🚀 Starting dev server on port ${PORT}...`)

        devServer = spawn('pnpm', ['dev'], {
            cwd: join(ROOT_DIR, 'demo', 'playground'),
            shell: true,
            stdio: ['ignore', 'pipe', 'pipe']
        })

        const timeout = setTimeout(() => {
            reject(new Error('Dev server failed to start within 30 seconds'))
        }, 30000)

        devServer.stdout.on('data', (data) => {
            const output = data.toString()

            // Show Vite output
            if (output.includes('VITE') || output.includes('Local:') || output.includes('ready')) {
                console.log(output.trim())
            }

            if (output.includes('Local:') || output.includes(`localhost:${PORT}`)) {
                clearTimeout(timeout)
                console.log(`✅ Dev server ready at http://localhost:${PORT}\n`)
                resolve()
            }
        })

        devServer.stderr.on('data', (data) => {
            console.error('Dev server error:', data.toString().trim())
        })

        devServer.on('error', (err) => {
            clearTimeout(timeout)
            reject(err)
        })
    })
}

// Stop dev server
function stopDevServer() {
    return new Promise((resolve) => {
        if (!devServer) {
            resolve()
            return
        }

        console.log('\n🛑 Stopping dev server...')

        if (platform() === 'win32') {
            const taskkill = spawn('taskkill', ['/pid', String(devServer.pid), '/f', '/t'])
            taskkill.on('close', () => {
                console.log('✅ Dev server stopped\n')
                resolve()
            })
        } else {
            devServer.kill('SIGTERM')
            console.log('✅ Dev server stopped\n')
            resolve()
        }
    })
}

// Run Playwright tests
function runPlaywrightTests() {
    return new Promise((resolve, reject) => {
        console.log('🎭 Running Playwright tests...\n')

        const args = [
            'test',
            './test/playground-assertions.spec.ts',
            '--config=playwright.config.ts',
            '--reporter=list'
        ]

        const playwright = spawn('npx', args, {
            cwd: ROOT_DIR,
            shell: true,
            stdio: 'inherit'
        })

        playwright.on('close', (code) => {
            if (code === 0) {
                console.log('\n✅ All tests passed!')
                resolve(code)
            } else {
                console.error(`\n❌ Tests failed with exit code ${code}`)
                reject(new Error(`Tests failed with exit code ${code}`))
            }
        })
    })
}

// Main execution
async function main() {
    try {
        // Start dev server
        await startDevServer()

        // Run tests
        await runPlaywrightTests()

        // Success
        process.exit(0)
    } catch (error) {
        console.error('\n❌ Test runner failed:', error.message)
        process.exit(1)
    } finally {
        // Always cleanup
        await stopDevServer()
    }
}

// Handle process termination
process.on('SIGINT', async () => {
    console.log('\n\n⚠️  Interrupted by user')
    await stopDevServer()
    process.exit(130)
})

process.on('SIGTERM', async () => {
    console.log('\n\n⚠️  Terminated')
    await stopDevServer()
    process.exit(143)
})

// Run
main()
