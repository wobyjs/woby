import { test, expect } from '@playwright/test'
import { spawn, ChildProcess } from 'child_process'

let devServer: ChildProcess | null = null
const PORT = 5276
const BASE_URL = `http://localhost:${PORT}`

interface TestResult {
    name: string
    passed: boolean
    message?: string
    error?: string
    type: 'pass' | 'fail' | 'info'
}

// Start dev server before tests
test.beforeAll(async () => {
    console.log(`🚀 Starting dev server on port ${PORT}...`)

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

                // Extract actual port from output
                const portMatch = output.match(/localhost:(\d+)/)
                if (portMatch) {
                    const actualPort = portMatch[1]
                    console.log(`✅ Dev server ready at http://localhost:${actualPort}`)
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

test.describe('Playground Test Assertions', () => {
    test('should execute playground tests and validate assertions', async ({ page }) => {
        const testResults: TestResult[] = []
        const assertionLogs: string[] = []
        const errors: string[] = []

        // Listen for console events
        page.on('console', msg => {
            const text = msg.text()

            // Capture all console messages for debugging
            console.log(`[Browser Console] ${text}`)

            // Capture assertion logs (✅ pass, ❌ fail, ℹ️ info)
            if (text.includes('✅') || text.includes('❌') || text.includes('ℹ️')) {
                assertionLogs.push(text)

                // Parse test results from logs
                if (text.includes('✅')) {
                    // Extract test name from various patterns
                    const patterns = [
                        /✅ (.+?) (test )?passed[:\s]*/i,
                        /✅ \[(.+?)\]/i,
                        /✅ (.+?) passed/i
                    ]

                    let testName = 'Unknown Test'
                    for (const pattern of patterns) {
                        const match = text.match(pattern)
                        if (match && match[1]) {
                            testName = match[1].trim()
                            break
                        }
                    }

                    testResults.push({
                        name: testName,
                        passed: true,
                        message: text,
                        type: 'pass'
                    })
                } else if (text.includes('❌')) {
                    // Extract test name and error from various patterns
                    const patterns = [
                        /❌ (.+?) failed[:\s]+(.+)/i,
                        /❌ (.+?) test failed[:\s]+(.+)/i,
                        /❌ \[(.+?)\][:\s]+(.+)/i
                    ]

                    let testName = 'Unknown Test'
                    let errorMsg = text
                    for (const pattern of patterns) {
                        const match = text.match(pattern)
                        if (match && match[1]) {
                            testName = match[1].trim()
                            if (match[2]) errorMsg = match[2].trim()
                            break
                        }
                    }

                    testResults.push({
                        name: testName,
                        passed: false,
                        error: errorMsg,
                        type: 'fail'
                    })
                } else if (text.includes('ℹ️')) {
                    // Info messages
                    const match = text.match(/ℹ️\s*(.+)/i)
                    testResults.push({
                        name: 'Info',
                        passed: true,
                        message: match ? match[1] : text,
                        type: 'info'
                    })
                }
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

        // Wait for all tests to execute (including setTimeout chains)
        console.log('⏳ Waiting for tests to execute...')
        await page.waitForTimeout(10000) // Initial wait for most tests

        // Log all captured assertions
        console.log('\n📋 Captured Test Assertions:')
        assertionLogs.forEach(log => console.log(`   ${log}`))

        // Verify we captured some test results
        if (assertionLogs.length === 0) {
            console.warn('⚠️  No assertion logs captured. Tests may not have executed.')
        }

        // Check for critical errors
        const criticalErrors = errors.filter(err =>
            !err.includes('Warning') &&
            !err.includes('DEV mode')
        )

        if (criticalErrors.length > 0) {
            console.error('❌ Critical errors detected:', criticalErrors)
            throw new Error(`Critical runtime errors:\n${criticalErrors.join('\n')}`)
        }

        // Validate test results
        const passedTests = testResults.filter(r => r.passed)
        const failedTests = testResults.filter(r => !r.passed)

        console.log(`\n📊 Test Results Summary:`)
        console.log(`   Total tests: ${testResults.length}`)
        console.log(`   Passed: ${passedTests.length}`)
        console.log(`   Failed: ${failedTests.length}`)
        console.log(`   Assertions captured: ${assertionLogs.length}`)

        if (failedTests.length > 0) {
            console.error('\n❌ Failed Tests:')
            failedTests.forEach(test => {
                console.error(`   - ${test.name}: ${test.error}`)
            })
            throw new Error(`Test failures detected:\n${failedTests.map(t => `${t.name}: ${t.error}`).join('\n')}`)
        }

        // If we have test results, ensure all passed
        if (testResults.length > 0) {
            expect(failedTests.length).toBe(0)
            console.log('✅ All playground tests passed!')
        } else {
            console.log('ℹ️  No explicit test results found, but no errors detected')
        }
    })
})
