# 🧪 Playground Test Quick Start Guide

## Overview

This test system automatically:
1. ✅ Starts the playground dev server (`pnpm dev` on port 5276)
2. ✅ Navigates to `http://localhost:5276` using Playwright
3. ✅ Captures all console logs, assertions (✅/❌), and errors
4. ✅ Parses test results from console output
5. ✅ Reports pass/fail status based on captured logs
6. ✅ Cleans up (stops dev server) after tests complete

## 🚀 Quick Start

### Run All Tests

```bash
cd d:\Developments\tslib\@woby\woby
pnpm test
```

This runs all test files in the `./test` directory.

### Run Specific Test Types

```bash
# Basic console log capture (simpler, faster)
pnpm run test:console

# Advanced assertion parsing with detailed reports (recommended)
pnpm run test:assertions

# Run with UI mode for debugging
pnpm run test:ui
```

### Direct Playwright Commands

```bash
# Run specific test file
npx playwright test ./test/playground-assertions.spec.ts

# Run with specific browser
npx playwright test ./test/playground-assertions.spec.ts --project=chromium

# Run in headed mode (see browser)
npx playwright test ./test/playground-assertions.spec.ts --headed

# Run with debug output
PLAYWRIGHT_DEBUG=true npx playwright test ./test/playground-assertions.spec.ts
```

## 📊 Expected Output

When tests run successfully, you'll see:

```
🚀 Starting dev server on port 5276...
[WebServer] VITE v4.5.14  ready in 500 ms
[WebServer] 
[WebServer] ➜  Local:   http://localhost:5276/
✅ Dev server ready at http://localhost:5276

[Browser Console] ✅ Event handler removal test passed: button incremented once and stopped at 1 after 4 clicks
[Browser Console] ✅ [TestComponent] SSR test passed: <div>test</div>
[Browser Console] ℹ️  Initial state: button value is 0

📋 Captured Test Assertions:
   ✅ Event handler removal test passed
   ✅ [TestComponent] SSR test passed
   ℹ️  Initial state: button value is 0

📊 Test Results Summary:
   Total tests: 2
   Passed: 2
   Failed: 0
   Assertions captured: 3

✅ All playground tests passed!
```

## 📁 Test Files

### `playground-console.spec.ts`
- **Purpose**: Basic console log capture
- **Use case**: Quick smoke tests, verifying no runtime errors
- **Features**:
  - Captures all console messages
  - Detects critical errors
  - Validates logs were generated
  - Fast execution

### `playground-assertions.spec.ts` ⭐ Recommended
- **Purpose**: Advanced test result parsing
- **Use case**: Full test validation with detailed reporting
- **Features**:
  - Parses ✅ (pass) and ❌ (fail) assertions
  - Extracts individual test results
  - Provides detailed summary statistics
  - Fails if any test fails
  - Handles multiple assertion formats

## 🔧 Configuration

### Playwright Config (`playwright.config.ts`)

```typescript
{
    testDir: './test',
    timeout: 60000,        // 60s total test timeout
    workers: 1,            // Single worker (dev server)
    retries: 0,
    reporter: [
        ['list'],          // Console output
        ['html']           // HTML report
    ],
    use: {
        baseURL: 'http://localhost:5276',
        headless: true,
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure'
    }
}
```

## 📝 Writing Tests in Playground

To add tests to your playground components:

### Basic Pattern

```tsx
// In playground/src/YourComponent.tsx

import { $ } from 'woby'
import { registerTestObservable } from './util'

const name = 'TestYourComponent'

const YourComponent = () => {
    const o = $(0)
    registerTestObservable(`${name}_o`, o)
    
    // Your component logic...
    
    // Add test assertion
    setTimeout(() => {
        const value = o()
        const expectedValue = 5
        
        if (value !== expectedValue) {
            console.error(`❌ ${name} failed: expected ${expectedValue}, got ${value}`)
        } else {
            console.log(`✅ ${name} passed: value is ${value}`)
        }
    }, 1000)
    
    return <div>{o}</div>
}

export default YourComponent
```

### Assertion Format

Use these emoji prefixes for automatic parsing:

- `✅ TestName passed: message` → Marked as **PASSED**
- `❌ TestName failed: error message` → Marked as **FAILED**
- `ℹ️ Info message` → Logged as information

### Advanced Pattern with SSR

```tsx
import { $, $$, renderToString, type JSX } from 'woby'
import { registerTestObservable, testObservables, assert } from './util'

const name = 'TestAdvancedComponent'

const AdvancedComponent = (): JSX.Element => {
    const o = $('initial')
    registerTestObservable(`${name}_o`, o)
    
    // Component implementation...
    
    return <div>{o}</div>
}

// Add SSR test
AdvancedComponent.test = {
    static: false,
    expect: () => {
        const value = $$(testObservables[`${name}_o`]) ?? 'default'
        const ssrComponent = testObservables[`${name}_ssr`]
        
        if (ssrComponent) {
            const ssrResult = renderToString(ssrComponent)
            const expected = '<div>expected</div>'
            
            if (ssrResult !== expected) {
                assert(false, `[${name}] SSR mismatch`)
            } else {
                console.log(`✅ [${name}] SSR test passed`)
            }
        }
        
        if (value === 'expected') {
            console.log(`✅ ${name} client test passed`)
        } else {
            console.error(`❌ ${name} failed: got ${value}`)
        }
    }
}

export default AdvancedComponent
```

## 🐛 Troubleshooting

### Dev Server Won't Start

**Problem**: Test fails with "Dev server failed to start"

**Solutions**:
1. Check if port 5276 is already in use:
   ```bash
   netstat -ano | findstr :5276
   ```
2. Kill existing process or change PORT in test file
3. Ensure playground has valid `package.json`
4. Run `pnpm install` in playground directory

### No Assertion Logs Captured

**Problem**: "No assertion logs captured" warning

**Solutions**:
1. Verify playground components are rendering
2. Check that test components use `console.log` with ✅/❌ emojis
3. Increase wait time in test file:
   ```typescript
   await page.waitForTimeout(15000) // Increase from 10000
   ```
4. Check browser console for JavaScript errors

### Tests Fail But Playground Works Manually

**Problem**: Manual testing works, but automated tests fail

**Solutions**:
1. Run in headed mode to see what's happening:
   ```bash
   npx playwright test ./test/playground-assertions.spec.ts --headed
   ```
2. Check for timing issues - async operations may need more time
3. Verify assertion format matches expected patterns
4. Check for runtime errors in browser console

### Process Cleanup Issues

**Problem**: Dev server doesn't stop after tests

**Solutions**:
1. Manually kill stuck processes:
   ```bash
   # Windows
   taskkill /F /IM node.exe
   
   # Linux/Mac
   pkill -f "vite"
   ```
2. Check test output for cleanup errors
3. Use Ctrl+C to force terminate test runner

## 📈 Advanced Features

### Custom Validation Logic

Add custom assertions beyond emoji parsing:

```typescript
// In your test file
const performanceLogs = assertionLogs.filter(log => 
    log.includes('performance') || log.includes('render time')
)

if (performanceLogs.length > 0) {
    console.log('Performance metrics:', performanceLogs)
    // Add custom expectations
    expect(performanceLogs).toContainEqual(
        expect.stringContaining('✅')
    )
}
```

### Multiple Page Testing

Test multiple routes or states:

```typescript
// Navigate to different pages
await page.goto(BASE_URL)
await page.waitForTimeout(5000)

await page.goto(`${BASE_URL}/#/another-route`)
await page.waitForTimeout(5000)

// Capture logs from each page
```

### Visual Debugging

Enable screenshots and traces:

```typescript
// Already configured in playwright.config.ts
use: {
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure'
}

// View trace after failure
npx playwright show-trace ./test-results/trace.zip
```

## 🎯 Best Practices

1. **Use clear, descriptive test names**
   ```tsx
   console.log(`✅ UserAuth component passed: login successful`)
   // Not: console.log(`✅ passed`)
   ```

2. **Include expected vs actual values in failures**
   ```tsx
   console.error(`❌ Counter test failed: expected 5, got ${value}`)
   ```

3. **Use appropriate log levels**
   - ✅ for definitive pass conditions
   - ❌ for definitive fail conditions  
   - ℹ️ for informational messages

4. **Time assertions appropriately**
   - Give async operations enough time
   - Use `setTimeout` chains for sequential tests
   - Consider using observables for reactive testing

5. **Clean up test artifacts**
   - Remove debug console.logs before committing
   - Keep test-specific code isolated
   - Document test dependencies

## 🔗 Related Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Test Fixtures](https://playwright.dev/docs/test-fixtures)
- [Console Log Capture](https://playwright.dev/docs/api/class-page#page-event-console)
- [Woby Framework Docs](../docs)

## 💡 Tips

- Run `pnpm run test:ui` for interactive test development
- Use `--debug` flag for step-by-step debugging
- Check `playwright-report/index.html` for visual reports
- Keep test wait times minimal but sufficient
- Use observables for reactive state testing

---

**Need Help?** Check the full README at `./test/README.md` for detailed documentation.
