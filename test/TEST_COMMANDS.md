# 🧪 Playground Test Commands Guide

## Quick Answer: Use `pnpm test`

**For normal testing, just use:**
```bash
pnpm test
```

This runs **both** test files and captures all console logs + assertions from the playground.

---

## Complete Test Command Structure

### Main Commands

| Command | What it does | When to use |
|---------|--------------|-------------|
| `pnpm test` | ✅ **Runs ALL tests** (both console + assertions) | **Default choice** - CI/CD, final validation |
| `pnpm test:ui` | Opens Playwright UI for interactive debugging | Debugging failures, exploring test results |

### Why Only Two Commands?

**Simplicity wins!** Since `pnpm test` already runs both test files, there's no need for separate commands in normal usage.

The other specialized commands were removed to keep things simple. If you need to run individual test files during development, just specify the file directly:
```bash
# Run specific test file (if needed for development)
playwright test ./test/playground-assertions.spec.ts
```

---

## What Happens When You Run `pnpm test`

```bash
pnpm test
└─> playwright test ./test
    ├─> test/playground-console.spec.ts      (Basic console capture)
    └─> test/playground-assertions.spec.ts   (Advanced assertion parsing)
```

**Note:** If you need to run individual test files during development, use:
```bash
# Run specific file directly with Playwright CLI
playwright test ./test/playground-assertions.spec.ts
playwright test ./test/playground-console.spec.ts
```

### Execution Flow

1. **Start dev server** in `demo/playground` (port 5276)
2. **Run test 1**: Console log capture
   - Navigate to http://localhost:5276
   - Capture all browser console messages
   - Detect errors and assertions
   - Validate logs were captured
3. **Run test 2**: Advanced assertion parsing
   - Navigate to http://localhost:5276
   - Parse ✅/❌/ℹ️ assertions from console
   - Extract individual test results
   - Generate summary report
4. **Stop dev server**
5. **Generate HTML report** at `playwright-report/index.html`

### Typical Output

```
Running 2 tests using 1 worker
✓  1 test\playground-console.spec.ts (10.2s)
✓  2 test\playground-assertions.spec.ts (13.5s)

2 passed (28.3s)
```

---

## When to Use Each Command

### ✅ `pnpm test` (99% of cases)

**Use for:**
- Daily development
- CI/CD pipelines
- Final validation before commits
- Running full test suite

**Example:**
```bash
# After making changes
git add .
git commit -m "Fix component"
pnpm test  # ← Just use this
```

### 🎨 `pnpm test:ui` (Debugging)

**Use for:**
- Investigating test failures
- Exploring test results visually
- Step-by-step debugging
- Viewing screenshots and traces

**Example:**
```bash
# Test failed, need to debug
pnpm test:ui
# Click through tests in browser UI
```

### 🔍 Direct Playwright CLI (Advanced Development)

**Use for:**
- Running specific test files only
- Faster feedback during test development
- Advanced filtering with Playwright options

**Examples:**
```bash
# Run only assertions test
playwright test ./test/playground-assertions.spec.ts

# Run only console test
playwright test ./test/playground-console.spec.ts

# Run with grep filter
playwright test --grep "SSR" ./test

# Run in headed mode
playwright test --headed ./test
```

---

## Test Files Explained

### 1. `playground-console.spec.ts`

**Purpose:** Basic console log capture  
**What it checks:**
- Dev server starts successfully
- Page loads without critical errors
- Console logs are generated
- No JavaScript runtime errors

**Best for:** Smoke testing, error detection

**Duration:** ~10 seconds

### 2. `playground-assertions.spec.ts` ⭐

**Purpose:** Advanced assertion parsing  
**What it checks:**
- All emoji-based assertions (✅/❌/ℹ️)
- Individual test pass/fail status
- SSR test results
- Observable state validation
- console.assert() failures

**Best for:** Comprehensive validation

**Duration:** ~14 seconds

**Total combined:** ~28 seconds

---

## HTML Report Visibility

Both tests now show detailed expectations in the HTML report:

### What You'll See

Open `pnpm exec playwright show-report` to view:

✅ **Test Steps**
- "Playground Test Results Summary"
  - Total tests: 1520
  - Passed: 1520
  - Failed: 0
  - Sample passing tests listed

✅ **Assertions**
- "Total test count" → Expected > 0 ✓
- "Should have no failed tests" → Expected: 0 ✓
- "Should have passed tests" → Expected > 0 ✓
- "Should have captured assertions" → Expected > 0 ✓
- "Should have captured console logs" → Expected > 0 ✓
- "Should have no errors" → Expected: 0 ✓

✅ **Console Logs**
- All browser console messages
- Individual test assertions
- Error messages (if any)

✅ **Attachments** (on failure)
- Screenshots
- Full execution trace
- Error context

---

## Performance Comparison

| Command | Duration | Tests Run | Use Case |
|---------|----------|-----------|----------|
| `pnpm test` | ~28s | 2 | **Default** |
| `pnpm test:ui` | ~28s + UI time | 2 | Debugging |
| Direct file (e.g., `playwright test ./test/playground-assertions.spec.ts`) | ~14s | 1 | Development |

**Recommendation:** Use `pnpm test` unless you have a specific reason not to.

---

## Migration Guide

### Old Commands → New Commands

```bash
# OLD                          # NEW
pnpm test                 →    pnpm test (unchanged)
pnpm test:ui              →    pnpm test:ui (unchanged)
pnpm test:single          →    Use: playwright test ./test/playground-assertions.spec.ts
pnpm test:console-only    →    Use: playwright test ./test/playground-console.spec.ts
```

### Why the Simplification?

- **One command for everything:** `pnpm test` runs both files
- **Direct CLI access:** For development, use Playwright directly
- **Less confusion:** No need to remember which command does what

---

## Examples

### Daily Development Workflow

```bash
# Make changes to code
git commit -m "Add new feature"

# Run full test suite
pnpm test

# If test fails, debug with UI
pnpm test:ui

# Fix issue, run tests again
pnpm test
```

### CI/CD Pipeline

```yaml
# .github/workflows/test.yml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: pnpm install
      - run: pnpm test  # ← Just use this
```

### Quick Validation

```bash
# Before pushing code
pnpm test

# Or if developing a specific test feature (use Playwright CLI directly)
playwright test ./test/playground-assertions.spec.ts
```

---

## Troubleshooting

### "Why are there two test files?"

**Answer:** They serve different purposes:
- Console test: Catches runtime errors, verifies page loads
- Assertions test: Parses individual test results, validates SSR

Together they provide comprehensive coverage.

### "Can I merge them into one file?"

**Answer:** You could, but separation provides benefits:
- Faster debugging (run just one)
- Clearer failure isolation
- Modular test structure

### "Which command should I teach new team members?"

**Answer:** Just teach them `pnpm test`. That's all they need!

### "How do I run a specific test file during development?"

**Answer:** Use the Playwright CLI directly:
```bash
# Run only assertions test
playwright test ./test/playground-assertions.spec.ts

# Run with filters
playwright test --grep "SSR" ./test
```

---

## Summary

**Simple Rule:**
- **Daily use:** `pnpm test`
- **Debugging:** `pnpm test:ui`
- **Advanced development:** Use Playwright CLI directly for specific files

The test suite is designed to be simple - just use `pnpm test` and you're good to go! 🎉

---

**Last Updated:** 2026-03-14  
**Status:** ✅ Consolidated and simplified
