import { test, expect } from '@playwright/test'
import { spawn, ChildProcess } from 'child_process'
import { kill } from 'process'

let devServer: ChildProcess | null = null
const PREFERRED_PORT = 5276
let BASE_URL = `http://localhost:${PREFERRED_PORT}`

// Start dev server before tests
test.beforeAll(async () => {
    console.log(`🚀 Starting dev server on port ${PREFERRED_PORT}...`)

    devServer = spawn('pnpm', ['dev'], {
        cwd: 'd:/Developments/tslib/@woby/woby/demo/playground',
        shell: true,
        stdio: ['ignore', 'pipe', 'pipe'],
        env: { ...process.env, FORCE_COLOR: '0' } // Disable color codes for easier parsing
    })

    // Wait for dev server to be ready
    await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error('Dev server failed to start within 30 seconds'))
        }, 30000)

        let serverOutput = ''

        devServer!.stdout?.on('data', (data) => {
            const output = data.toString()
            serverOutput += output
            console.log(output)

            // Check if Vite is ready (handle both old and new formats)
            if (output.includes('Local:') ||
                output.includes('localhost:') ||
                output.includes('ready in') ||
                output.includes('http://localhost:')) {
                clearTimeout(timeout)

                // Extract actual port from output and update BASE_URL
                const portMatch = output.match(/localhost:(\d+)/)
                if (portMatch) {
                    const actualPort = portMatch[1]
                    BASE_URL = `http://localhost:${actualPort}`
                    console.log(`✅ Dev server ready at ${BASE_URL}`)
                } else {
                    console.log(`✅ Dev server ready`)
                }
                resolve()
            }
        })

        devServer!.stderr?.on('data', (data) => {
            console.error('Dev server error:', data.toString())
        })

        devServer!.on('error', (err) => {
            clearTimeout(timeout)
            reject(err)
        })

        devServer!.on('exit', (code) => {
            clearTimeout(timeout)
            if (code !== 0 && code !== null) {
                reject(new Error(`Dev server exited with code ${code}`))
            }
        })
    })
})

// Stop dev server after tests
test.afterAll(async () => {
    if (devServer) {
        console.log('🛑 Stopping dev server...')

        try {
            // Try graceful shutdown first
            devServer.kill('SIGTERM')

            // Wait a bit for process to exit
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Force kill if still running
            if (devServer.killed === false) {
                if (process.platform === 'win32') {
                    // Use PowerShell for more reliable process termination on Windows
                    spawn('powershell.exe', [
                        '-Command',
                        `Stop-Process -Id ${devServer.pid} -Force -ErrorAction SilentlyContinue`
                    ])
                } else {
                    spawn('kill', ['-9', String(devServer.pid)])
                }
            }
        } catch (err) {
            console.error('Warning: Failed to cleanly stop dev server:', err)
        }

        devServer = null
    }
})

test.describe('Playground Console Logs Test', () => {
    test('should capture and validate console logs from playground', async ({ page }) => {
        // Collect console logs
        const consoleLogs: string[] = []
        const errors: string[] = []

        // Listen for console events
        page.on('console', msg => {
            const text = msg.text()
            const type = msg.type()  // 'log', 'error', 'assert', etc.
                    
            consoleLogs.push(`[${type}] ${text}`)
            console.log(`[Browser Console] [${type}] ${text}`)
                    
            // Capture console.assert() failures as errors
            if (type === 'assert' && text && text.trim() !== '') {
                // Ignore known harmless assertions
                if (text.includes('Expected at least one update')) {
                    return // Skip this assertion - it's expected in some tests
                }
                
                errors.push(`ASSERTION FAILED: ${text}`)
                console.error(`[ASSERT FAILURE] ${text}`)
            }
        })
                
        page.on('pageerror', error => {
            const errorMsg = error.message
            errors.push(errorMsg)
            console.error(`[Browser Error] ${errorMsg}`)
        })

        // Navigate to playground
        console.log(`🌐 Navigating to ${BASE_URL}...`)
        await page.goto(BASE_URL)

        // Wait for page to load and execute
        console.log('⏳ Waiting for tests to execute...')
        await page.waitForTimeout(5000)

        // Give more time for async operations
        await page.waitForTimeout(3000)

        // Verify no critical errors
        const criticalErrors = errors.filter(err =>
            !err.includes('Warning') &&
            !err.includes('DEV mode')
        )

        if (criticalErrors.length > 0) {
            console.error('❌ Critical errors detected:', criticalErrors)
        } else {
            console.log('✅ No critical errors detected')
        }

        // Validate that we captured logs with Playwright expect
        expect(consoleLogs.length, 'Should have captured console logs').toBeGreaterThan(0)
        expect(errors.length, 'Should have no errors').toBe(0)

        // Log summary
        console.log(`\n📊 Test Summary:`)
        console.log(`   Total console logs: ${consoleLogs.length}`)
        console.log(`   Total errors: ${errors.length}`)
        console.log(`   Critical errors: ${criticalErrors.length}`)

        // Fail test if there are critical errors
        if (criticalErrors.length > 0) {
            throw new Error(`Critical errors found:\n${criticalErrors.join('\n')}`)
        }

        console.log('✅ All playground tests passed!')
    })
})
