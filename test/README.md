# Playground Test Integration with Playwright

This document describes the Playwright test setup that captures console logs and assertions from the playground dev server.

## Overview

The test system:
1. Starts the playground dev server (`pnpm dev` in `demo/playground`)
2. Navigates to `http://localhost:5276`
3. Captures all console logs, assertions, and errors
4. Parses test results from console output
5. Reports test pass/fail status based on captured logs

## Test Files

### 1. `playground-console.spec.ts`
Basic test that:
- Starts dev server automatically
- Captures all console logs
- Detects critical errors
- Validates that logs were captured

### 2. `playground-assertions.spec.ts` (Recommended)
Advanced test that:
- Starts dev server automatically
- Parses assertion logs (✅/❌/ℹ️)
- Extracts individual test results
- Provides detailed test summary
- Fails on any test failure detected in logs

## Usage

### Run tests from CLI

```bash
# From woby root directory
pnpm test

# Or specifically
npx playwright test ./test
```

### Run with UI mode

```bash
pnpm test:ui
```

### Run specific test file

```bash
# Basic console capture
npx playwright test ./test/playground-console.spec.ts

# Advanced assertion parsing
npx playwright test ./test/playground-assertions.spec.ts
```

## How It Works

### Dev Server Management

```typescript
// beforeAll: Start dev server
test.beforeAll(async () => {
    devServer = spawn('pnpm', ['dev'], {
        cwd: 'd:/Developments/tslib/@woby/woby/demo/playground',
        shell: true
    })
    // Wait for "Local:" message
})

// afterAll: Cleanup
test.afterAll(async () => {
    if (devServer) {
        spawn('taskkill', ['/pid', String(devServer.pid), '/f', '/t'])
    }
})
```

### Console Log Capture

```typescript
page.on('console', msg => {
    const text = msg.text()
    
    // Capture assertion logs
    if (text.includes('✅') || text.includes('❌') || text.includes('ℹ️')) {
        assertionLogs.push(text)
        
        // Parse test results
        if (text.includes('✅')) {
            testResults.push({ name: extractedName, passed: true })
        } else if (text.includes('❌')) {
            testResults.push({ name: extractedName, passed: false, error: extractedError })
        }
    }
})
```

### Test Result Parsing

The test parses logs matching these patterns:
- ✅ `{testName}` test passed → Mark as passed
- ❌ `{testName}` failed: `{error}` → Mark as failed
- ℹ️ `{testName}` → Info log (not counted as pass/fail)

## Example Output

```
🚀 Starting dev server on port 5276...
✅ Dev server ready at http://localhost:5276
🌐 Navigating to http://localhost:5276...
⏳ Waiting for tests to execute...

📋 Captured Test Assertions:
   ✅ Event handler removal test passed: button incremented once and stopped at 1 after 4 clicks
   ✅ [TestComponent] SSR test passed: <div>test</div>
   ℹ️  Initial state: button value is 0

📊 Test Results Summary:
   Total tests: 2
   Passed: 2
   Failed: 0
   Assertions captured: 3

✅ All playground tests passed!
```

## Creating Test Components in Playground

To add tests to your playground components:

```tsx
// In your TestComponent.tsx in playground/src/

import { $, $$, renderToString, type JSX } from 'woby'
import { registerTestObservable, testObservables, assert } from './util'

const name = 'TestMyComponent'

const MyComponent = (): JSX.Element => {
    const o = $(0)
    registerTestObservable(`${name}_o`, o)
    
    // Your component logic...
    
    // Add test assertions
    setTimeout(() => {
        const value = o()
        if (value !== expectedValue) {
            console.error(`❌ ${name} failed: expected ${expectedValue}, got ${value}`)
        } else {
            console.log(`✅ ${name} passed: value is ${value}`)
        }
    }, 1000)
    
    return <div>{o}</div>
}

export default MyComponent
```

## Configuration

### playwright.config.ts (woby root)

```typescript
{
    testDir: './test',
    timeout: 60000,           // 60s total test timeout
    workers: 1,               // Single worker for dev server
    retries: 0,
    reporter: [
        ['list'],             // Console output
        ['html']              // HTML report in playwright-report/
    ],
    use: {
        baseURL: 'http://localhost:5276',
        headless: true,
        trace: 'retain-on-failure',
    }
}
```

## Troubleshooting

### Dev server fails to start
- Check if port 5276 is available
- Verify playground has valid `package.json`
- Ensure pnpm is installed

### No assertion logs captured
- Verify playground components are rendering
- Check browser console for errors
- Increase wait time in test if needed

### Tests fail but playground works
- Check for runtime errors in browser
- Verify assertion format (✅/❌ emojis)
- Check timing - async operations may need more time

## Advanced Features

### Custom Test Validation

You can add custom validation logic:

```typescript
// After capturing logs
const customAssertions = assertionLogs.filter(log => 
    log.includes('custom-test')
)

if (customAssertions.length > 0) {
    // Validate custom test criteria
    expect(customAssertions).toContainEqual(
        expect.stringContaining('✅')
    )
}
```

### Multiple Page Navigation

Test multiple routes:

```typescript
await page.goto(BASE_URL)
await page.waitForTimeout(3000)

await page.goto(`${BASE_URL}/another-route`)
await page.waitForTimeout(3000)
```

### Screenshot on Failure

Automatically captured via Playwright config:
```typescript
use: {
    screenshot: 'only-on-failure'
}
```

## Best Practices

1. **Use clear assertion messages**: Include test name and expected vs actual values
2. **Use emojis consistently**: ✅ for pass, ❌ for fail, ℹ️ for info
3. **Add timing buffers**: Give async operations enough time to complete
4. **Clean up resources**: Dev server is automatically killed after tests
5. **Minimize console noise**: Only log important assertions during tests

## Future Enhancements

- [ ] Support for multiple test pages/routes
- [ ] Snapshot testing integration
- [ ] Performance metrics collection
- [ ] Visual regression testing
- [ ] Parallel test execution with isolated servers
