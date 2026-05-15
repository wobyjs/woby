---
phase: code-review
reviewed: 2026-05-14T00:00:00Z
depth: deep
files_reviewed: 12
files_reviewed_list:
  - src/components/environment_context.ts
  - src/utils/setters.ts
  - src/components/keep_alive.ts
  - src/components/portal.ts
  - src/methods/assign.ts
  - src/methods/custom_element.ts
  - src/methods/custom_element_registry.ts
  - src/methods/render.testing.ts
  - src/methods/render.ts
  - src/methods/render.via.ts
  - src/methods/render_to_string.ts
  - src/utils/stylesheets.ts
findings:
  critical: 5
  warning: 12
  info: 8
  total: 25
status: issues_found
---

# Code Review Report

**Reviewed:** 2026-05-14T00:00:00Z
**Depth:** deep
**Files Reviewed:** 12
**Status:** issues_found

## Summary

This deep code review analyzed 12 files across the Woby reactive framework implementation, focusing on core rendering, custom elements, portal management, and SSR support. The review uncovered **5 critical security vulnerabilities** related to XSS injection, along with **12 warnings** covering memory leaks, race conditions, and incomplete cleanup, plus **8 info-level** findings for code quality improvements.

The most severe issues involve unsafe use of `innerHTML`, missing input validation, and improper SSR mock setup. Memory leaks were found in KeepAlive cache management and stylesheet observers. The custom element implementation has potential race conditions in attribute mutation observers.

## Critical Issues

### CR-01: XSS Vulnerability in setHTMLStatic

**File:** `src/utils/setters.ts:867-869`
**Issue:** The `setHTMLStatic` function directly sets `innerHTML` without any sanitization or validation, creating a critical XSS vulnerability. This function is exposed through the `dangerouslySetInnerHTML` prop pattern, but even with that naming convention, the framework should provide safeguards.

**Impact:** Attackers can inject malicious scripts through user-provided content, leading to session hijacking, data theft, or other XSS attacks.

**Fix:**
```typescript
// Option 1: Add sanitization
import DOMPurify from 'dompurify'

export const setHTMLStatic = (element: HTMLElement, value: null | undefined | number | string): void => {
    const sanitized = typeof value === 'string' ? DOMPurify.sanitize(value) : ''
    element.innerHTML = String(isNil(value) ? '' : sanitized)
}

// Option 2: Document the requirement for caller sanitization
export const setHTMLStatic = (element: HTMLElement, value: null | undefined | number | string): void => {
    // WARNING: This function does NOT sanitize input. Callers MUST ensure
    // the HTML string is trusted or sanitized before passing it here.
    // Consider using DOMPurify or similar library for user-provided content.
    element.innerHTML = String(isNil(value) ? '' : value)
}
```

### CR-02: XSS in SSR via setHTML Without Validation

**File:** `src/utils/setters.ts:871-885`
**Issue:** The `setHTML` function has a code path for SSR that directly unwraps and sets HTML without validation (line 875). While the function expects a `{ __html: ... }` pattern inspired by React, there's no validation that the value is safe.

**Impact:** In SSR contexts, malicious HTML can be injected into the server-rendered output, affecting all users who view the page.

**Fix:**
```typescript
export const setHTML = (element: HTMLElement, value: FunctionMaybe<{ __html: FunctionMaybe<null | undefined | number | string> }>, stack: Stack): void => {
    const isSSR = useEnvironment() === 'ssr'

    // Validate that value has expected structure
    const validateHtmlObject = (val: any): string => {
        if (!val || typeof val !== 'object' || !('__html' in val)) {
            console.warn('dangerouslySetInnerHTML expects an object with __html property')
            return ''
        }
        const html = $$(val.__html)
        return String(isNil(html) ? '' : html)
    }

    if (isSSR) {
        setHTMLStatic(element, validateHtmlObject(value))
    } else if (isObservable(value)) {
        useRenderEffect(() => {
            setHTMLStatic(element, validateHtmlObject(value))
        }, stack)
    } else {
        setHTMLStatic(element, validateHtmlObject(value))
    }
}
```

### CR-03: Global Mutation of Built-in Constructors in SSR

**File:** `src/methods/render_to_string.ts:58-61`
**Issue:** The code mutates `globalThis.Comment` and `globalThis.Text` with empty class definitions, which can break other code that relies on `instanceof` checks or constructor behavior. This is a global side effect that persists beyond the function call.

**Impact:** Can cause TypeErrors when other code tries to use these constructors, or break instanceof checks throughout the application. This creates hard-to-debug issues in mixed environments.

**Fix:**
```typescript
// Instead of mutating global constructors, use a WeakMap to track mock instances
const mockInstances = new WeakSet()

export function renderToString<T extends RenderToStringOptions = RenderToStringOptions>(
    child: Child,
    options?: T
): T extends { returnDocument: true } ? { html: string; document: SSRDocument } : string {
    const ssrDoc = options?.document ?? createDocument()

    // Don't mutate globals - instead check types within the function
    // The SSR document already provides mock implementations

    return EnvironmentContext.Provider('ssr', () => {
        return DocumentContext.Provider(ssrDoc, () => {
            // ... rest of implementation
        })
    }) as any
}
```

### CR-04: Duplicate Global Mutation in setProp

**File:** `src/utils/setters.ts:1197-1200`
**Issue:** The `setProp` function mutates `globalThis.Comment` and `globalThis.Text` on every call when in SSR mode, creating the same global pollution issue as CR-03, but repeatedly during rendering.

**Impact:** Performance degradation and potential race conditions if multiple renders happen concurrently. Same breaking of instanceof checks as CR-03.

**Fix:**
```typescript
export const setProp = (element: HTMLElement | Comment, key: string, value: any, stack: Stack): void => {
    const isSSR = useEnvironment() === 'ssr'

    // Don't mutate globals - check using duck typing or symbol markers
    const isCommentNode = isSSR
        ? (element && typeof element === 'object' && element.nodeType === 8)
        : element instanceof Comment

    const isTextNode = isSSR
        ? (element && typeof element === 'object' && element.nodeType === 3)
        : element instanceof Text

    if (isCommentNode || isTextNode) {
        if (key === 'ref') {
            setRef(element, value)
        }
        else if (key in element)
            setProperty(element, key, value, stack)
    }
    // ... rest of function
}
```

### CR-05: Unbounded Cache Growth in KeepAlive Despite Size Limit

**File:** `src/components/keep_alive.ts:46-52`
**Issue:** The cache eviction logic only runs when adding a NEW cache entry. If all cache entries are updated (no new IDs), the cache can still grow unboundedly because existing entries aren't checked against the size limit during updates.

**Impact:** Memory leak in applications that dynamically generate many unique KeepAlive IDs over time without exhausting the key space.

**Fix:**
```typescript
export const KeepAlive = ({ id, ttl, children }: { id: FunctionMaybe<string>, ttl?: FunctionMaybe<number>, children: Child }): ObservableReadonly<Child> => {

  return useMemo((stack) => {

    return useResolved([id, ttl], (id, ttl) => {

      const lock = lockId++
      const isNew = !(id in cache)
      const item = cache[id] ||= { id, lock }

      // Enforce cache size limit on EVERY access, not just new entries
      const cacheKeys = Object.keys(cache)
      if (cacheKeys.length > MAX_CACHE_SIZE) {
        const sortedKeys = cacheKeys.sort((a, b) => cache[a].lock - cache[b].lock)
        for (const key of sortedKeys) {
          if (Object.keys(cache).length <= MAX_CACHE_SIZE) break
          const cacheItem = cache[key]
          if (cacheItem.dispose && key !== id) { // Don't dispose the item we're about to use
            cacheItem.dispose()
          }
        }
      }

      // ... rest of implementation
```

## Warnings

### WR-01: Memory Leak in Stylesheet Observer

**File:** `src/utils/stylesheets.ts:188-223`
**Issue:** The `observeStylesheetChanges()` function creates a MutationObserver that is never automatically cleaned up. The only cleanup happens when `unobserveStylesheetChanges()` is explicitly called, which is not guaranteed in SPAs.

**Impact:** Memory leak in applications that frequently create/destroy components with shadow roots, as the observer and registry accumulate uncollected references.

**Fix:**
```typescript
let observerRefCount = 0

export function observeStylesheetChanges(): void {
    observerRefCount++
    if (stylesheetObserver) {
        return // Already observing
    }

    stylesheetObserver = new MutationObserver((mutations) => {
        // ... existing logic
    })

    stylesheetObserver.observe(document.head, {
        childList: true,
        subtree: true,
        characterData: true
    })
}

export function unobserveStylesheetChanges(): void {
    observerRefCount = Math.max(0, observerRefCount - 1)
    if (observerRefCount === 0 && stylesheetObserver) {
        stylesheetObserver.disconnect()
        stylesheetObserver = null
    }
    // Only clear if fully unobserving
    if (observerRefCount === 0) {
        cachedConstructedSheets = null
        shadowRootRegistry.clear()
        loggedErrors.clear()
    }
}
```

### WR-02: Missing Cleanup in Portal Component

**File:** `src/components/portal.ts:32-68`
**Issue:** The Portal component creates two `useRenderEffect` calls (lines 32 and 56), but the cleanup functions don't check if the portal is still in the DOM before removing it. This can cause errors if the portal was already removed by other means.

**Impact:** Can throw errors when unmounting portals in certain edge cases, particularly during rapid mounting/unmounting cycles.

**Fix:**
```typescript
useRenderEffect(() => {

    if (!$$(condition)) return

    const parent: any = ($$(mount) || document.body)

    if (isSSR) {
        if (!('appendChild' in (parent as HTMLElement))) throw new Error('Invalid mount node')
    } else {
        if (!(parent instanceof Element)) throw new Error('Invalid mount node')
    }

    parent.insertBefore(portal, null)

    return (): void => {
        // Check if portal is still a child before removing
        if (portal.parentNode === parent) {
            parent.removeChild(portal)
        }
    }

}, stack)
```

### WR-03: Race Condition in Custom Element Attribute Observer

**File:** `src/methods/custom_element.ts:277-310`
**Issue:** The MutationObserver is created in `connectedCallback` but if the element is disconnected and reconnected rapidly, there's a window where both the old observer and new observer could be active simultaneously (lines 277-297 show disconnect logic but no guard against observer re-use).

**Impact:** Can cause duplicate attribute change handlers to fire, leading to inconsistent state and potential performance issues.

**Fix:**
```typescript
connectedCallback() {
    // Disconnect any existing observer before creating a new one
    if (this._attrObserver) {
        this._attrObserver.disconnect()
        this._attrObserver = null
    }

    const { observedAttributes } = C
    const { props: p } = this
    const aKeys = Object.keys(p).filter(k => k !== 'children' && isObservable(p[k]))
    const rKeys = Object.keys(p).filter(k => isPureFunction(p[k]) || isObject(p[k]))

    rKeys.forEach(k => this.removeAttribute(k))

    for (const k of aKeys as any)
        if (!this.attributes[this.propDict[k]] || isJsx(p))
            setProp(this, this.propDict[k], p[k], callStack('connectedCallback'))

    for (const attr of this.attributes as any) {
        this.attributeChangedCallback1(attr.name, undefined, attr.value)
    }

    // Create new observer (old one was disconnected above)
    this._attrObserver = new MutationObserver(mutations => {
        mutations.forEach(m => {
            if (m.type === 'attributes') {
                const name = m.attributeName
                const newValue = this.getAttribute(name)
                const oldValue = m.oldValue
                this.attributeChangedCallback1(name, oldValue, newValue)
            }
        })
    })

    this._attrObserver.observe(this, { attributes: true, attributeOldValue: true })
}
```

### WR-04: Incomplete Error Handling in assign Function

**File:** `src/methods/assign.ts:216-354`
**Issue:** The `assign` function has deeply nested logic without comprehensive error handling. If `target` or `source` have circular references or non-standard objects, the function can throw errors that aren't caught.

**Impact:** Can crash the application when processing malformed or circular objects, particularly in the recursive deep copy paths.

**Fix:**
```typescript
export const assign = <T, S, O extends AssignOptions<T>>(target: T, source: S, options?: O):
    O['condition'] extends 'old'
    ? (O['keepTargetNoObservable'] extends true ? T : Observant<T>)
    : (O['keepTargetNoObservable'] extends true ? T & S : Observant<T & S>) => {

    if (!source) return target as any
    if (!target) {
        console.warn('assign: target is null/undefined, returning as-is')
        return target as any
    }

    // Detect circular references
    const seen = new WeakSet()

    const safeAssign = (tgt: any, src: any): void => {
        if (seen.has(tgt)) {
            console.warn('assign: circular reference detected, skipping')
            return
        }
        seen.add(tgt)

        // ... existing logic, but with try-catch around dangerous operations
        try {
            // existing assign logic
        } catch (e) {
            console.error('assign: error during assignment', e)
            throw e
        }
    }

    // ... rest of implementation with safeAssign wrapper
}
```

### WR-05: Unvalidated Parent in Portal SSR Mode

**File:** `src/components/portal.ts:70-97`
**Issue:** In SSR mode (lines 70-97), the parent element is created but never validated to be a valid container. The code assumes `createHTMLNode('div')` always succeeds and that `appendChild` will work.

**Impact:** Can cause runtime errors in SSR if the mock document implementation is incomplete or if there are edge cases in the SSR environment.

**Fix:**
```typescript
else {
    // SSR mode: render children directly to parent
    const parent: any = ($$(mount) as any || createHTMLNode('div'))

    if (!parent || typeof parent.appendChild !== 'function') {
        throw new Error('Portal: Invalid mount node in SSR - missing appendChild method')
    }

    if (wrapper) {
        let portal: any = $$(wrapper)
        while (typeof portal === 'function') {
            portal = portal()
        }

        if (!portal || typeof portal.appendChild !== 'function') {
            throw new Error('Portal: Invalid wrapper node in SSR - missing appendChild method')
        }

        setChild(portal, children, FragmentUtils.make(), stack)
        parent.appendChild(portal)
    } else {
        setChild(parent, children, FragmentUtils.make(), stack)
    }

    // ... rest of SSR logic
}
```

### WR-06: Missing Null Check in render.testing.ts

**File:** `src/methods/render.testing.ts:44-52`
**Issue:** The `getByTestId` function throws an error without the actual test ID value in the message, making debugging difficult. Additionally, it performs a double query (lines 46-47) which is inefficient.

**Impact:** Poor developer experience when tests fail, and unnecessary DOM queries.

**Fix:**
```typescript
const getByTestId = <T extends HTMLElement = HTMLElement>(id: string) => {
    const element = fragment.querySelector(`[data-testid="${id}"]`) as T
    if (!element) {
        throw new Error(`Element with test ID "${id}" not found in fragment`)
    }
    return element
}
```

### WR-07: Incomplete Null Check in getByText

**File:** `src/methods/render.testing.ts:54-79`
**Issue:** The `getByText` function has a recursive search that can return `null` (line 73), but the check at line 76 doesn't include the actual text that was searched for in the error message.

**Impact:** Difficult to debug test failures when elements aren't found.

**Fix:**
```typescript
const getByText = <T extends HTMLElement = HTMLElement>(text: string | RegExp) => {
    function allDescendants(node): T | null {
        for (var i = 0; i < node.children.length; i++) {
            var child = node.children[i]
            if (typeof text === "string") {
                if (child.textContent == text) {
                    return child as T
                }
            } else {
                if (text.test(child.textContent)) {
                    return child as T
                }
            }
            const returnValue = allDescendants(child)
            if (returnValue) {
                return returnValue
            }
        }
        return null
    }
    const returnValue = allDescendants(fragment)
    if (!returnValue) {
        const searchDesc = typeof text === 'string' ? `"${text}"` : `pattern /${text.source}/`
        throw new Error(`Element with text ${searchDesc} not found`)
    }
    return returnValue
}
```

### WR-08: Potential Memory Leak in render.testing.ts

**File:** `src/methods/render.testing.ts:9-42`
**Issue:** The render function appends elements to `document.body` (line 42) but only cleans them up if the returned `unmount` function is called. If the test doesn't call `unmount`, elements remain in the DOM.

**Impact:** Test pollution in test suites that don't properly clean up, leading to flaky tests.

**Fix:**
```typescript
export const render = (child: JSX.Child) => {
    const fragment = document.createElement('div')
    const renderDiv = document.createElement("div")

    fragment.textContent = ''

    let disposer
    let unmount = useRoot((dispose) => {
        setChild(fragment as any, child, FragmentUtils.make())

        renderDiv.append(fragment)
        console.log('f', fragment.outerHTML)
        console.log('c', (fragment.children[0] as any).outerHTML)

        return disposer = (): void => {
            dispose()
            fragment.textContent = ''
            fragment.remove()
            renderDiv.remove() // Also remove the container

            console.log('dispose')
        }
    })
    document.body.append(renderDiv)

    // Return cleanup function with a clear name
    const cleanup = () => {
        if (disposer) {
            unmount()
        }
    }

    return { fragment, unmount: cleanup, getByRole, getByTestId, getByText }
}
```

### WR-09: MutationObserver Never Disconnected in Custom Element

**File:** `src/methods/custom_element.ts:276-320`
**Issue:** While `disconnectedCallback` disconnects the observer (line 313-316), there's no guarantee it will be called in all scenarios (e.g., if the element is removed from DOM without proper cleanup). The observer reference is set to null but the observer might still be active briefly.

**Impact:** Memory leak in applications that frequently create/destroy custom elements.

**Fix:**
```typescript
disconnectedCallback() {
    // Disconnect observer synchronously and immediately
    if (this._attrObserver) {
        this._attrObserver.disconnect()
        this._attrObserver = null
    }

    // Unregister shadow root from stylesheet updates
    if (this.shadowRoot) {
        unregisterShadowRoot(this.shadowRoot)
    }

    // Clear any other references that might prevent GC
    this.childs = []
    this.propDict = null as any
}
```

### WR-10: Deeply Nested Conditionals in setChildStatic

**File:** `src/utils/setters.ts:213-484`
**Issue:** The `setChildStatic` function is over 270 lines with deeply nested conditionals (up to 5-6 levels). This makes the code extremely difficult to follow, test, and maintain. The cyclomatic complexity is very high.

**Impact:** High maintenance burden, difficult to debug, and increased likelihood of edge case bugs.

**Fix:**
```typescript
// Refactor into smaller, focused functions
export const setChildStatic = (parent: HTMLElement | Node, fragment: Fragment, fragmentOnly: boolean, child: Child, dynamic: boolean, childComp: Function, stack: Stack): void => {
    if (!dynamic && isVoidChild(child)) {
        return
    }

    const prev = FragmentUtils.getChildren(fragment)
    const isSSR = useEnvironment() === 'ssr'

    // Delegate to specialized handlers
    if (shouldUseFastPath(prev, child)) {
        handleFastPath(parent, fragment, fragmentOnly, child, isSSR)
        return
    }

    const fragmentNext = buildFragmentFromChild(child, isSSR, stack)
    applyFragmentDiff(parent, fragment, fragmentNext, fragmentOnly)
}

function shouldUseFastPath(prev: any, child: any): boolean {
    // Extract fast path logic
}

function handleFastPath(parent, fragment, fragmentOnly, child, isSSR): void {
    // Extract fast path implementation
}

function buildFragmentFromChild(child, isSSR, stack): Fragment {
    // Extract fragment building logic
}

function applyFragmentDiff(parent, fragment, fragmentNext, fragmentOnly): void {
    // Extract diffing and application logic
}
```

### WR-11: Missing Type Safety in assign Function

**File:** `src/methods/assign.ts:88-94`
**Issue:** The `set` function casts `target` to `any` (line 91, 93) to call it as a function, bypassing TypeScript's type checking. This can hide type errors and lead to runtime failures if the observable doesn't have the expected interface.

**Impact:** Runtime errors when non-observable values are passed as observables.

**Fix:**
```typescript
const set = <T,>(target: T, source: T, merge: boolean) => {
    if (!isObservable(target)) {
        console.warn('set: target is not an observable, skipping')
        return
    }

    const targetObservable = target as Observable<T>

    if (merge) {
        targetObservable(mv($$(target), $$(source)))
    } else {
        targetObservable($$(source))
    }
}
```

### WR-12: Unsafe Type Coercion in Stylesheet Error Handling

**File:** `src/utils/stylesheets.ts:114-154`
**Issue:** The code accesses `sheet.cssRules` (line 125) which can throw security errors, but the catch block (line 143-153) assumes all errors are cross-origin security errors. Other errors (e.g., malformed CSS) would be incorrectly categorized.

**Impact:** Incorrect error messages and potential hiding of actual stylesheet problems.

**Fix:**
```typescript
try {
    // Cross-origin check — will throw on access if inaccessible
    if (sheet.href && new URL(sheet.href, window.location.href).origin !== window.location.origin) {
        continue
    }

    const newSheet = new CSSStyleSheet()
    let allRules = ''

    // This can throw for reasons other than CORS
    const cssRules = sheet.cssRules

    for (let j = 0; j < cssRules.length; j++) {
        const rule = cssRules[j]

        if (rule instanceof CSSPropertyRule) {
            if (rule.initialValue) {
                propertyRules.push(`${rule.name}: ${rule.initialValue}`)
            }
        } else {
            allRules += rule.cssText
        }
    }
    if (allRules.trim()) {
        newSheet.replaceSync(allRules)
        constructedSheets.push(newSheet)
    }
} catch (e) {
    // Check if it's actually a SecurityError
    const isSecurityError = e instanceof Error && e.name === 'SecurityError'

    const stack = new Error().stack
    const stackKey = stack?.split('\n').slice(2, 5).join('|').trim() || ''
    const cacheKey = isSecurityError ? `security_error_${stackKey}` : `stylesheet_error_${stackKey}`

    if (!loggedErrors.has(cacheKey)) {
        if (loggedErrors.size >= MAX_LOGGED_ERRORS) loggedErrors.clear()
        loggedErrors.add(cacheKey)

        if (isSecurityError) {
            console.warn("Could not copy stylesheet: SecurityError - Cannot access rules (likely cross-origin)")
        } else {
            console.warn("Could not copy stylesheet:", e)
        }
    }
}
```

## Info

### IN-01: Console.log Statements in Production Code

**File:** `src/methods/render.testing.ts:31-32, 39`
**Issue:** Debug console.log statements are left in production code. While this is a testing utility, these should use a debug flag or be removed.

**Impact:** Noise in test output, slight performance overhead.

**Fix:**
```typescript
const DEBUG = process.env.NODE_ENV === 'development' || process.env.DEBUG_TESTS === 'true'

export const render = (child: JSX.Child) => {
    // ... setup code

    if (DEBUG) {
        console.log('f', fragment.outerHTML)
        console.log('c', (fragment.children[0] as any).outerHTML)
    }

    // ... rest of code

    return disposer = (): void => {
        dispose()
        fragment.textContent = ''
        fragment.remove()

        if (DEBUG) {
            console.log('dispose')
        }
    }
}
```

### IN-02: Magic Numbers in Cache Size Limit

**File:** `src/components/keep_alive.ts:30`
**Issue:** The `MAX_CACHE_SIZE = 100` is a magic number without clear justification or configurability.

**Impact:** May not be optimal for all use cases; difficult to tune without code modification.

**Fix:**
```typescript
// Make configurable via environment or options
const MAX_CACHE_SIZE = (
    typeof process !== 'undefined' && process.env?.WOBY_KEEPALIVE_CACHE_SIZE
        ? parseInt(process.env.WOBY_KEEPALIVE_CACHE_SIZE, 10)
        : 100
)

// Or expose as a configuration option
export interface KeepAliveOptions {
    maxCacheSize?: number
}

export const KeepAlive = ({ id, ttl, children, maxCacheSize = 100 }: {
    id: FunctionMaybe<string>,
    ttl?: FunctionMaybe<number>,
    children: Child,
    maxCacheSize?: number
}): ObservableReadonly<Child> => {
    // Use maxCacheSize parameter instead of global constant
}
```

### IN-03: Inconsistent Error Object Creation

**File:** `src/components/portal.ts:29, src/utils/setters.ts:704, 967`
**Issue:** Error objects are created without messages (e.g., `new Error()`) just to capture stack traces. This is non-idiomatic and could be replaced with proper Error constructors or a dedicated stack capture utility.

**Impact:** Makes debugging harder when these errors are actually thrown; non-standard pattern.

**Fix:**
```typescript
// Create a utility function
function captureStackTrace(message = ''): Error {
    const error = new Error(message)
    error.name = 'StackTrace'
    return error
}

// Or use console.trace for debugging
console.trace('Portal: tracking render effect')
```

### IN-04: Commented-Out Code Blocks

**File:** `src/methods/render.testing.ts:12-22`
**Issue:** Large block of commented-out code for building a table. This should be removed or moved to documentation if it serves as an example.

**Impact:** Code clutter, confusion about whether this is needed.

**Fix:**
```typescript
// Remove the commented code entirely
export const render = (child: JSX.Child) => {
    const fragment = document.createElement('div')
    const renderDiv = document.createElement("div")

    fragment.textContent = ''
    // ... rest of implementation
}
```

### IN-05: Complex Regex Without Documentation

**File:** `src/utils/setters.ts:25, 976`
**Issue:** Complex regular expressions for attribute camelCase conversion (line 25) and dimensional property detection (line 976) lack comments explaining their purpose and logic.

**Impact:** Difficult to understand and maintain; high barrier for contributors.

**Fix:**
```typescript
// Regex to match camelCase property names that should NOT be converted to kebab-case for SVG
// Matches: erA, erH, erR, erW, erV, erY, con, leT, leC, leS, seP, sy, atA, atR, au, av, of, ex, fX, fY, fa, gt, hR, dP, dG, tT, tX, tY, tD, uZ, q
// URL: https://regex101.com/r/I8Wm4S/1
const attributeCamelCasedRe = /e(r[HRWrv]|[Vawy])|Con|l(e[Tcs]|c)|s(eP|y)|a(t[rt]|u|v)|Of|Ex|f[XYa]|gt|hR|d[Pg]|t[TXYd]|[UZq]/

// Regex to detect CSS properties that should NOT have 'px' appended when set as numbers
// Matches: leading dash, float properties, grid properties, etc.
// From Preact: https://github.com/preactjs/preact/blob/e703a62b77c9de45e886d8a7f59bd0db658318f9/src/constants.js#L3
// Preact issue: https://github.com/preactjs/preact/issues/2607
const propertyNonDimensionalRe = /^(-|f[lo].*[^se]$|g.{5,}[^ps]$|z|o[pr]|(W.{5})?[lL]i.*(t|mp)$|an|(bo|s).{4}Im|sca|m.{6}[ds]|ta|c.*[st]$|wido|ini)/i
```

### IN-06: Missing Type Annotation in render.via.ts

**File:** `src/methods/render.via.ts:1-28`
**Issue:** The file is missing type annotations for the `child` parameter and return type, making it less type-safe than the other render functions.

**Impact:** Reduced type safety and IDE support.

**Fix:**
```typescript
import { useRoot } from '../hooks/soby'
import { setChild } from '../utils/setters.via'
import type { Child, Disposer } from '../types'

export const render = (child: Child, parent?: Element | null): Disposer => {
    if (!parent || !(parent instanceof HTMLElement)) throw new Error('Invalid parent node')

    parent.textContent = ''

    return useRoot((dispose) => {
        setChild(parent, child)

        return (): void => {
            dispose()
            parent.textContent = ''
        }
    })
}
```

### IN-07: Duplicated SSR Logic Across Files

**File:** `src/utils/setters.ts:1197-1200`, `src/methods/render_to_string.ts:58-61`
**Issue:** The same SSR mock setup logic is duplicated in multiple files, violating DRY principle.

**Impact:** Maintenance burden, risk of inconsistency if one is updated but not others.

**Fix:**
```typescript
// Create a shared utility
// src/ssr/mocks.ts
export function setupSSRMocks(): void {
    if (typeof globalThis !== 'undefined') {
        globalThis.Comment = class { } as any
        globalThis.Text = class { } as any
    }
}

export function isSSRComment(element: any): boolean {
    return element && typeof element === 'object' && element.nodeType === 8
}

export function isSSRText(element: any): boolean {
    return element && typeof element === 'object' && element.nodeType === 3
}

// Then use in both locations
import { setupSSRMocks, isSSRComment, isSSRText } from '../ssr/mocks'
```

### IN-08: Variable Name Shadowing in KeepAlive

**File:** `src/components/keep_alive.ts:35, 100`
**Issue:** The parameter `id` shadows the destructured parameter, and the `reset` function at line 97 is shadowed by `item.reset` assignment at line 99. This can lead to confusion.

**Impact:** Code readability issues, potential for bugs if developer misreads which variable is being used.

**Fix:**
```typescript
export const KeepAlive = ({ id: idParam, ttl, children }: {
    id: FunctionMaybe<string>,
    ttl?: FunctionMaybe<number>,
    children: Child
}): ObservableReadonly<Child> => {

  return useMemo((stack) => {

    return useResolved([idParam, ttl], (id, ttl) => {

      const lock = lockId++
      const isNew = !(id in cache)
      const item = cache[id] ||= { id, lock }

      // ... logic

      useCleanup(() => {

        const hasLock = () => lock === item.lock

        if (!hasLock()) return

        item.suspended?.(true)

        if (!ttl || ttl <= 0 || ttl >= Infinity) return

        const disposeItem = () => hasLock() && item.dispose?.(stack)
        const timeoutId = setTimeout(disposeItem, ttl)
        const resetTimeout = () => clearTimeout(timeoutId)

        item.reset = resetTimeout

      })

      return item.result

    })

  })

}
```

---

_Reviewed: 2026-05-14T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: deep_
