import { test, expect } from '@playwright/test'
import { spawn, ChildProcess } from 'child_process'

let devServer: ChildProcess | null = null
const PREFERRED_PORT = 5276
let BASE_URL = `http://localhost:${PREFERRED_PORT}`

// Module-level storage for collected test data (shared across all tests)
const collectedTestData = new Map<string, { logs: string[], failures: string[] }>()
let testDataReady = false

// Start dev server before tests
test.beforeAll(async () => {
    console.log(`🚀 Starting dev server on port ${PREFERRED_PORT}...`)

    devServer = spawn('pnpm', ['dev'], {
        cwd: 'd:/Developments/tslib/@woby/woby/demo/playground',
        shell: true,
        stdio: ['ignore', 'pipe', 'pipe'],
        env: { ...process.env, FORCE_COLOR: '0' } // Disable color codes
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

            // Check if Vite is ready
            if (output.includes('Local:') ||
                output.includes('localhost:') ||
                output.includes('ready in') ||
                output.includes('http://localhost:')) {
                clearTimeout(timeout)

                // Extract actual port from output
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
            console.error(`Dev server error: ${data.toString()}`)
        })

        devServer!.on('error', (err) => {
            clearTimeout(timeout)
            reject(err)
        })
    })
})

// Stop dev server after tests
test.afterAll(async () => {
    if (devServer) {
        console.log('🛑 Stopping dev server...')
        devServer.kill()
        devServer = null
    }
})

// Helper function to extract test name from log text
function extractTestName(text: string): string {
    const testNameMatch = text.match(/\[([A-Za-z0-9_]+)\]/)
    return testNameMatch ? testNameMatch[1] : 'General'
}

// Helper function to format console message
function formatConsoleMessage(type: string, text: string, location: any): string {
    let formattedMessage = `[${type.toUpperCase()}] ${text}`
    if (location.url) {
        formattedMessage += ` (${location.url}:${location.lineNumber || '?'})`
    }
    return formattedMessage
}

test('capture and replay browser console logs', async ({ page }) => {
    console.log('\n📋 === TEST STARTED ===')
    console.log(`Navigating to: ${BASE_URL}`)

    // Listen to browser console events
    page.on('console', msg => {
        const type = msg.type()
        const text = msg.text()
        const location = msg.location()

        const formattedMessage = formatConsoleMessage(type, text, location)
        const testName = extractTestName(text)

        // Reprint in Playwright console immediately
        console.log(`🌐 BROWSER: ${formattedMessage}`)

        // Store data for later test generation
        if (!collectedTestData.has(testName)) {
            collectedTestData.set(testName, { logs: [], failures: [] })
        }

        const testData = collectedTestData.get(testName)!
        testData.logs.push(formattedMessage)

        // Add Playwright assertions based on log content
        if (formattedMessage.includes('✅')) {
            // For success logs, expect them to contain ✅
            try {
                expect(formattedMessage).toContain('✅')
            } catch (error) {
                testData.failures.push(`Assertion failed for: ${formattedMessage}`)
            }
        } else {
            // For non-success logs, expect them to equal a random string (will fail)
            const randomValue = Math.random().toString(36).substring(7)
            try {
                expect(formattedMessage).toEqual(randomValue)
            } catch (error) {
                testData.failures.push(`Expected failure for: ${formattedMessage} (matched random: ${randomValue})`)
            }
        }
    })

    // Listen to page errors
    page.on('pageerror', error => {
        const errorMessage = `[PAGE ERROR] ${error.message}`
        const testName = 'PageErrors'
        if (!collectedTestData.has(testName)) {
            collectedTestData.set(testName, { logs: [], failures: [] })
        }
        collectedTestData.get(testName)!.logs.push(errorMessage)
        console.error(`❌ BROWSER ERROR: ${errorMessage}`)
    })

    // Navigate to the playground
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 })

    // Wait a bit to capture any delayed console logs
    await page.waitForTimeout(2000)

    // Take a screenshot for visual verification
    await page.screenshot({
        path: 'test-results/console-capture-screenshot.png',
        fullPage: true
    })

    console.log('\n📊 === CONSOLE LOG SUMMARY ===')
    console.log(`Total test groups collected: ${collectedTestData.size}`)

    let totalLogs = 0
    let totalFailures = 0

    for (const [testName, data] of collectedTestData.entries()) {
        totalLogs += data.logs.length
        totalFailures += data.failures.length
        console.log(`  [${testName}]: ${data.logs.length} logs, ${data.failures.length} failures`)
    }

    console.log(`\n📈 Total: ${totalLogs} logs, ${totalFailures} failures`)
    console.log('\n📋 === TEST FINISHED ===\n')

    // Mark data as ready for module-level test generation
    testDataReady = true

    // Expect at least some content to be loaded
    await expect(page).toHaveTitle(/playground/i)
})

// Create a separate test that runs grouped assertions using test.step()
test('generate and run grouped tests', async ({ page }) => {
    // Wait for data to be ready
    await test.step('Wait for test data collection', async () => {
        let attempts = 0
        while (!testDataReady && attempts < 10) {
            await page.waitForTimeout(100)
            attempts++
        }
    })

    // Run assertions for each test group within this test
    let totalGroups = 0
    let passedGroups = 0
    let failedGroups = 0
    const failedGroupNames: string[] = []
    
    for (const [testName, data] of collectedTestData.entries()) {
        await test.step(`[${testName}]`, async () => {
            totalGroups++
            console.log(`\n🧪 Test Group: [${testName}]`)
            console.log(`   Logs: ${data.logs.length}, Failures: ${data.failures.length}`)

            // Assert on the number of logs captured
            expect(data.logs.length, `Test [${testName}] should have console logs`).toBeGreaterThan(0)

            // Assert each log is captured
            data.logs.forEach((log, idx) => {
                expect.soft(log, `[${testName}] Log #${idx + 1}`).toBeDefined()
                console.log(`   📝 Captured: ${log}`)
            })

            // Track failures without throwing
            if (data.failures.length > 0) {
                console.log(`   ❌ Failed Assertions: ${data.failures.length}`)
                data.failures.forEach((failure, idx) => {
                    console.log(`      ${idx + 1}. ${failure}`)
                })
                failedGroups++
                failedGroupNames.push(testName)
            } else {
                passedGroups++
                console.log(`   ✅ All ${data.logs.length} logs captured successfully for [${testName}]`)
            }
        })
    }
    
    // Final summary - this will appear in the report
    console.log('\n' + '='.repeat(80))
    console.log('📊 === FINAL TEST SUMMARY ===')
    console.log(`Total Test Groups: ${totalGroups}`)
    console.log(`✅ Passed: ${passedGroups}`)
    console.log(`❌ Failed: ${failedGroups}`)
    
    if (failedGroups > 0) {
        console.log('\n❌ Failed Test Groups:')
        failedGroupNames.forEach(name => {
            console.log(`   - [${name}]`)
        })
    }
    console.log('='.repeat(80))
    
    // Assert final summary (this creates a report entry without stack trace)
    expect(passedGroups, `Passed ${passedGroups}/${totalGroups} test groups`).toBe(totalGroups)
})