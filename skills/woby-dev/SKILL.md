---
name: woby-dev
description: >
  Debugging and developing the woby/soby library itself (not apps built with woby). Use this skill when modifying woby source files, diagnosing bugs in soby reactivity, working with the playground dev server, dealing with Vite module cache issues, tracing deepResolve/observable/callable internals, or testing SSR behavior. Invoke for any work on D:/Developments/tslib/@woby/woby or @woby/soby source.
---

# Woby/Soby Library Dev Skill

## Repo Layout

```
D:/Developments/tslib/@woby/
├── woby/                    ← main library (imports soby)
│   ├── src/                 ← TypeScript source
│   ├── dist/                ← built output (auto-generated)
│   └── demo/playground/     ← Vite dev server + test components
└── soby/                    ← reactive core (signals/observables)
    ├── src/                 ← TypeScript source (EDIT HERE)
    └── dist/                ← built output (Vite imports this)
```

**Edit rule:** Always edit `src/` files, then rebuild. Editing `dist/` directly is only for quick diagnosis; any rebuild will overwrite it.

---

## Dev Server (Playground)

```powershell
# Start
cd D:/Developments/tslib/@woby/woby/demo/playground
pnpm dev    # → http://localhost:5276/

# Kill by port (when server hangs)
$pid = (Get-NetTCPConnection -LocalPort 5276 -State Listen).OwningProcess
Stop-Process -Id $pid -Force
```

The playground imports soby from `D:/Developments/tslib/@woby/soby/dist/`. After rebuilding soby, **restart the dev server** — Vite caches module content in memory and won't pick up file changes without a restart.

---

## Build Workflow

```powershell
# Rebuild soby (also bumps patch version automatically)
cd D:/Developments/tslib/@woby/soby
pnpm build   # runs tsex compile + pnpm bump

# Rebuild woby
cd D:/Developments/tslib/@woby/woby
pnpm build
```

After rebuilding soby: restart the playground dev server.

---

## Testing with Playwright

The playground auto-runs tests on load and logs results to the browser console. Use Playwright to read them:

```typescript
// Navigate and check errors
await page.goto('http://localhost:5276/')
const msgs = await page.evaluate(() =>
  window.__playwright_console ?? []
)

// Filter for test results
// ✅ [TestName] SSR test passed: ...
// ✅ Expect function test passed for TestName
// ❌ FAIL / [ASSERT] / Error: ...
```

**Console level meanings:**
- `[LOG]` — test pass/fail markers, component output
- `[ASSERT]` — test assertion failures (check these first)
- `[ERROR]` — uncaught errors (stack overflows, type errors, etc.)

### Quick Playwright snippet

```javascript
// In browser_evaluate
const results = performance.getEntriesByType('measure')
const errors = []
// listen for errors
window.addEventListener('error', e => errors.push(e.message))
```

---

## Key Internal Files

### `soby/src/methods/deep_resolve.ts`
Recursively resolves observables and arrays. Critical for `fn.toString()` and `fn.valueOf()`.

```typescript
export function deepResolve<T>(value: T, returnFunction: boolean = true): any {
  if (isFunction(value)) {
    // returnFunction=false + NOT observable → return plain function as-is
    // (prevents event handler functions stored in $() from being called)
    if (!returnFunction && !isObservable(value)) {
      return value
    }
    // Unwrap observable (always — even when returnFunction=false)
    if (isObservable(value)) {
      return deepResolve(value(), returnFunction)
    }
    return value  // plain function when returnFunction=true
  }
  // arrays recurse...
}
```

**The `returnFunction=false` invariant:**
- `returnFunction=false` means "don't call plain functions, just return them"
- BUT observables must still be unwrapped even with `returnFunction=false`
- Used by `fn.toString()` in callable.ts so string coercion resolves the observable value without calling non-observable functions (which would invoke event handlers)

### `soby/src/objects/callable.ts`
Creates the observable function wrappers (`readable`, `writable`, `frozen`).

```typescript
const readable = <T>(value: IObservable<T>, stack?: Stack): ObservableReadonly<T> => {
  const fn = readableFunction.bind(value as any) as ObservableReadonly<T>
  fn.valueOf = () => deepResolve(fn)           // resolves for arithmetic ops
  fn.toString = () => deepResolve(fn, false).toString()  // resolves for string coercion
  fn[SYMBOL_OBSERVABLE] = true
  fn[SYMBOL_OBSERVABLE_READABLE] = value
  return fn
}
```

**`fn.toString()` chain:** template literal `${obs}` → `obs.toString()` → `deepResolve(obs, false)` → unwraps observable → gets inner value → `.toString()` on that value.

If `deepResolve(obs, false)` returned `obs` unchanged (old bug: guard was `!returnFunction` not `!returnFunction && !isObservable`), then `.toString()` calls `obs.toString()` → infinite recursion.

### `soby/src/methods/is_observable.ts`
```typescript
const isObservable = (value) =>
  isFunction(value) && (SYMBOL_OBSERVABLE in value)
```

All readable/writable observables have `SYMBOL_OBSERVABLE = true`. This is how `deepResolve` distinguishes observables from plain functions.

### `woby/src/methods/make.ts`
Wraps component props in `$()` observables when a component uses `defaults()`. Called during custom element prop assignment.

```typescript
// Primitive props get wrapped in $()
// Functions are NOT wrapped (convertFunction: false)
// Already-observable values are left alone
```

This means when a JSX prop like `value={321}` is passed to a custom element, by the time the component sees it, `value` is `$(321)` — an observable.

### `woby/src/hooks/use_context.ts`
`useContext()` returns the raw observable stored in context when `isStaticValue=false` (normal JSX usage). The stored value is whatever was passed as the `value` prop — which has gone through `make()` and is therefore a `$()` observable.

---

## Common Bug Patterns

### Stack overflow in `fn.toString()`

**Symptom:** `RangeError: Maximum call stack size exceeded` in `deepResolve` or `fn.toString`.

**Cause:** An observable holding a non-primitive value (function, observable, etc.) gets string-coerced (template literal, `String()`, `.toString()`).

**Trace:**
1. Something calls `obs.toString()`
2. `callable.ts`: `fn.toString = () => deepResolve(fn, false).toString()`
3. `deepResolve(fn, false)` with old guard `!returnFunction` returns `fn` unchanged
4. `.toString()` on `fn` → calls `fn.toString()` again → loop

**Fix location:** `soby/src/methods/deep_resolve.ts` — guard must be `!returnFunction && !isObservable(value)`.

### Event handler firing twice (custom elements)

**Symptom:** Click handler called 2× per click.

**Cause:** Woby's document-level event delegation walks `composedPath()` through shadow DOM. After you call `onClick()` explicitly, the delegation loop still reaches the host element's `_onclick` property and fires again.

**Fix:** Add `e.stopPropagation()` at the top of the internal `handleClick` function inside the custom element.

### Vite serving stale module after rebuild

**Symptom:** Fix applied to `soby/dist/`, rebuild ran, but browser console still shows old line numbers or old behavior.

**Cause:** Vite caches transformed module content in memory. The `@fs/` URL Vite uses for the soby dist file is cached from before the rebuild.

**Fix:** Kill the playground dev server process (by port 5276) and restart it. Simple browser hard-refresh is NOT enough.

### Observable function passed as event prop — not called

**Symptom:** `onClick` prop set, handler registered, but nothing fires on click.

**Cause:** Using Pattern 2 (observable function) but calling `onClick()` directly as if it's Pattern 1. `onClick` is the observable wrapper; `onClick()` with no args returns the STORED function, doesn't call it.

**Fix:** `const fn = (onClick as any)?.(); if (typeof fn === 'function') fn()`

---

## Debugging Workflow

1. **Read the playground console errors first.** Playwright `browser_console_messages(level: 'error')` surfaces stack overflows and assertion failures immediately.

2. **Check file timestamps.** If you rebuilt soby but errors still reference old line numbers, Vite cache is stale — restart the server.

3. **Add temporary `console.log` to dist/** for quick diagnosis when source maps aren't enough. Remove before committing by rebuilding from clean source.

4. **Use `isObservable(value)`** to distinguish observables from plain functions in any reactive utility code.

5. **Follow the deepResolve call chain** for any issue involving string coercion, valueOf, or infinite loops:
   - Start at the template literal or `.toString()` call in user code
   - Trace: `fn.toString()` → `deepResolve(fn, false)` → check guard → unwrap or return

---

## Test Component Locations

```
demo/playground/src/
├── TestRefContext.tsx        — ref callback + useContext observable string coercion
├── TestWobyOnClick.tsx       — Observable function onClick prop (Pattern 2)
├── TestShadowOnClick.tsx     — Plain function onClick + stopPropagation (Pattern 1)
├── TestHtmlOnClick.tsx       — HtmlFunction onClick (Pattern 3)
├── TestCustomElementBasic.tsx
├── TestContextComponents.tsx
├── TestDirective.tsx
└── ...
```

Each test file exports a component and optionally a `.test` object with `expect()` for automated DOM assertions. The playground index imports all test components and runs `expect()` on load.

---

## Playground Test Protocol

1. Start or restart dev server
2. Navigate to `http://localhost:5276/`
3. Check console: `browser_console_messages(level: 'error')` → should be 0 errors
4. Check specific tests: `browser_console_messages(level: 'info')` → grep for `✅` / `❌`
5. For click tests (TestWobyOnClick, TestShadowOnClick): these require DOM — they auto-fire clicks via `button.click()` in `useEffect`
