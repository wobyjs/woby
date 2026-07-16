# Handoff: Context API & Custom Element API Review

**Date:** 2026-07-16
**Scope reviewed:** `src/methods/custom_element.ts` (930 lines), `src/methods/context_ref.ts`, `src/methods/create_context.tsx`, `src/hooks/use_context.ts`, `src/methods/make.ts`, `src/methods/defaults.ts`, supporting utils.
**Audience:** downstream AI agent (or human) executing the fixes/refactors. Follow the phases in order; each phase has its own verification gate.

---

## 0. Current repo state — read first

- Branch `main`. There is an **uncommitted change** in `src/methods/custom_element.ts`: `mergeInto` now replaces the consumer's default observable with the incoming JSX observable (`defaultProps[key] = incoming`) instead of snapshotting via `obs($$(incoming))`. This preserves two-way reactivity (see commit `92cffd9`) but has a side effect described in finding **A7**. Decide on A7 before committing this diff.
- Prior verified review findings live in project memory (`code-review-custom-element.md`, `context-ref-connectedcallback-fix.md`); they are re-verified and folded into this doc — this doc supersedes them.

### Build & test protocol (mandatory between phases)

```powershell
# Rebuild woby after src changes
cd D:/Developments/tslib/@woby/woby
pnpm build

# Playground dev server — ONCE per session, port NOT in 5xxx range
cd D:/Developments/tslib/@woby/woby/demo/playground
pnpm dev --port 7214

# Drive Chrome with the dv CLI (pick a free profile dv1–dv6)
dv2 start --headed
dv2 navigate --url http://localhost:7214
dv2 console --type error    # must be 0 errors
dv2 console --type log      # grep for ✅ / ❌ test markers
```

Gotchas:
- `dv console` caps at ~1000 messages; the playground suite can exceed it. Filter (`--type error` first) and use targeted `dv2 get-text` / `dv2 eval` on specific test subtrees.
- After rebuilding **soby**, restart the dev server — Vite caches module content in memory; hard refresh is not enough.
- When writing playground tests, scope every `querySelector` inside your own test's unique subtree; never rely on test index/order.

---

## 1. Architecture summary (grounding)

### Custom element API (`custom_element.ts`)

`customElement(tag, component)` registers either a browser class (`createBrowserCustomElement`) or an SSR mock. The browser class:

1. **Constructor** — builds props from `defaults()`' `SYMBOL_DEFAULT` factory. Two modes:
   - **JSX-created** (`isJsx(props)`): merges JSX values into default observables via `mergeInto`, sets `SYMBOL_JSX`, renders via plain `setChild(this, ...)` (no shadow DOM here; light-DOM path at line ~399).
   - **HTML-created** (no JSX props): syncs HTML attributes → observables, attaches shadow root, adopts stylesheets, creates a `<slot>`, then renders the component into the shadow root — inside a replayed soby context chain if one is discoverable.
2. **Context replay machinery** — soby context is dynamically scoped and dies when the constructor's scope ends. To let slotted descendants (separate soby roots) see providers, provider elements store a `SYMBOL_CONTEXT_WRAP` replay function on their DOM node; `collectAncestorContextWrap` walks DOM ancestors (crossing shadow boundaries via `assignedSlot`/`host`) and composes them. Invisible JSX providers hand their wrap to the enclosing custom element through the module-level pending-wrap side channel (`setPendingContextWrap` / `composePendingContextWrap` / `consumePendingContextWrap` / `peekPendingContextWrap`).
3. **connectedCallback** — reflects absent attributes from observable props, replays `attributeChangedCallback1` for every present attribute (skipping `@`-refs for JSX-created elements — already resolved in the constructor), and installs a per-element `MutationObserver` for attribute changes.
4. **`setObservableValue`** — the single write path from attribute string → observable, handling `@`-prefix context refs (reactive share or effect-bridge), `@@` escaping, and typed conversion via `ObservableOptions` (`type` + `fromHtml`).
5. **`setNestedProperty`** — handles `style$x` / `a$b$c` paths.

### Context API

- `createContext(defaultValue)` (`create_context.tsx`) returns `{ Provider, symbol }`. The Provider is a `defaults()` component: in JSX it is **invisible** (pure soby `context({symbol: value}, ...)` plus `composePendingContextWrap` for DOM discoverability); with `visible={true}` or when used as the native `<context-provider>` element it renders a real DOM node.
- `useContext` (`use_context.ts`) reads `CONTEXTS_DATA` for the symbol and queries soby's ambient `context(symbol)`; `isStatic` controls whether the stored observable is unwrapped.
- `@`-prefix refs (`context_ref.ts`): `registerContextRef('scope.field', ctx)` fills a registry; `resolveContextRef(ref, element)` resolves with a strategy that depends on `element.isConnected`:
  - **Constructor path** (not connected): ambient `context(symbol)` first, then pending wrap. No DOM walk possible.
  - **Connected path**: DOM ancestor-wrap walk first, then pending wrap, then ambient.

**Invariants that must not break:**
- JSX-created elements resolve `@`-refs in the constructor; `connectedCallback` must skip re-resolving them (line ~451) — re-resolution would return defaults because ambient context is gone.
- The pending-wrap global only accumulates; sibling ordering correctness in the constructor path depends on preferring ambient context over the pending wrap (see the long comment at `context_ref.ts:217-233`).
- `mergeInto` must never call `defaultObs(incomingFn)` with a function — soby writables treat function args as updaters and would *invoke* the incoming value.

---

## 2. Findings — bugs (fix in this order)

### A1. `style$` attribute path bypasses `@`-context-ref resolution — CONFIRMED, HIGH

- **Where:** `setNestedProperty`, `custom_element.ts:766-774`.
- **What:** the `style.` early-return writes the raw attribute string into `obj.style[prop]` and returns. `style$color="@theme.primary"` puts the literal string `@theme.primary` into CSS. `@@` escaping is also skipped.
- **Fix sketch:** before assigning, check `isContextRef(value)` → `resolveContextRef(value, obj)`; if the result is an observable, bind via `root(() => effect(...))` (mirror the connectedCallback bridge in `setObservableValue`, including disposer push onto `__contextRefDisposers`); handle `@@` → `@` unescape. Consider extracting the resolve-and-bridge block out of `setObservableValue` so both call sites share it (see C2).
- **Test:** playground component with `style$color="@theme.primary"` under a provider; assert computed style equals resolved value, and updates when the provider observable changes.

### A2. Dual write + junk prop keys for `$`/`.` attribute paths — CONFIRMED, MEDIUM

- **Where:** `attributeChangedCallback1`, `custom_element.ts:511-515`.
- **What:** for paths containing `$`/`.` it calls `setNestedProperty` **and then also** `setObservableValue(props, propName, ...)` where `propName = kebabToCamelCase(name.replace(/\$/g,'.').replace(/\./g,'.'))`. `kebabToCamelCase` does not touch dots, so this writes garbage keys like `props["style.color"] = value` (non-observable branch `obj[key] = value`). The second `.replace(/\./g, '.')` is a literal no-op.
- **Fix sketch:** drop the second `setObservableValue` call entirely — `setNestedProperty` already routes non-style nested paths into `setObservableValue` on the right target. If flat-prop mirroring of nested paths is genuinely needed somewhere, prove it with a failing test first; otherwise it is pure junk-state creation.

### A3. Suspected double component invocation in constructor — VERIFY FIRST, HIGH IF REAL

- **Where:** both render branches, `custom_element.ts:340-348` and `370-378`.
- **What:** `createElement()` returns an unmemoized `wrapElement(() => ...)` closure (`wrap_element.ts` — no caching). The constructor calls `componentResult()` in a `depth < 10` unwrap loop and **discards** every result, then passes the same `componentResult` to `setChild`, which invokes it again. If real, every custom element component executes twice per construction: duplicate observable/effect creation in an unrooted scope (leak risk), and providers call `composePendingContextWrap` twice, composing the same wrap into the chain twice.
- **Verify:** add a module-level render counter to a playground component registered as a custom element; construct it once; log the counter. Also check whether removing the loop breaks any context tests — the loop may have been an attempt to force synchronous provider side effects before `setChild` (note the pending-wrap capture happens *after* `setChild`, so that rationale looks stale).
- **Fix sketch (if confirmed):** delete the unwrap loops from both branches. Run the FULL playground suite — context provider chains (Theme → Counter → Nested), slotted descendants, and `@`-ref tests are the regression surface.

### A4. `rKeys` attribute removal uses camelCase names — CONFIRMED, LOW

- **Where:** `connectedCallback`, `custom_element.ts:421-423`.
- **What:** `rKeys` are camelCase prop keys but `removeAttribute(k)` needs the kebab-case attribute name (HTML lowercases attribute names, so `removeAttribute('myProp')` targets `myprop`, not `my-prop`). Multi-word function/object props are never actually removed.
- **Fix:** `this.removeAttribute(this.propDict[k] ?? k)`.

### A5. JSX primitive observable props reflected to host attributes — DESIGN DECISION, CONFIRM INTENT

- **Where:** `connectedCallback`, `custom_element.ts:425-443`.
- **What:** for JSX-created elements, primitive-valued observable props with no authored attribute get reflected onto the host (`setProp`). The code comment documents this as intentional ("populate defaults for props the author did not write"), and object values / present attributes are skipped. Residual effect: JSX-only props become visible HTML attributes → CSS attribute selectors, MutationObserver noise, serialization changes. **Action:** confirm with maintainer whether default-reflection is wanted; if yes, delete this finding; if no, restore an `isJsx(p)` skip.

### A6. `make(null)` returns `{} as Observant<T>` — type lie, LOW

- **Where:** `make.ts:28-31`. Callers via `defaults()` are safe (defaults are merged immediately after). Fix by tightening the signature (require `obj`) or throwing on nullish input. Low priority; do last.

### A7. Uncommitted `mergeInto` change drops the consumer's typed-observable options — DECIDE BEFORE COMMIT

- **Where:** `custom_element.ts:229-238` (working-tree diff).
- **What:** `defaultProps[key] = incoming` shares the provider's observable instance (good: two-way reactivity). But the discarded default observable carried the element's `ObservableOptions` (`HtmlNumber`, `HtmlBoolean`, `fromHtml`, …). All later HTML-attribute syncs (`setObservableValue`, MutationObserver path) read options from the *incoming* observable, which is typically untyped. So after JSX passes plain `$(5)` into an `HtmlNumber` prop, a later `setAttribute('value', '7')` stores the **string** `"7"`.
- **Note:** the equivalent context-ref replacement path already `console.warn`s on option mismatch (`custom_element.ts:632-636`); `mergeInto` replaces silently.
- **Options:** (a) accept + document ("incoming observable's options win; type your shared observables"); (b) warn like the context-ref path does; (c) copy the default's options onto the incoming observable when the incoming one has none. Recommend (b) now, (c) only if playground tests demand it.
- **Test to add:** JSX `<x-el value={$(5)}>` where default is `$(0, HtmlNumber)`; then `el.setAttribute('value','7')`; assert `typeof $$(props.value) === 'number'`.

---

## 3. Findings — dead code & trivial cleanups (safe batch)

All in `custom_element.ts` unless noted. Zero behavior change expected; do as one commit.

| # | Item | Location |
|---|------|----------|
| B1 | `useEffect(() => { })` no-op call; unused destructure `const { Provider, value } = this.props[SYMBOL_CONTEXT] ?? {}` (line 300 reads `this.props.value` directly, not the destructured binding) | 298-300 |
| B2 | Unused import `SYMBOL_UNTRACKED_UNWRAPPED` | 30 |
| B3 | `static observedAttributes = []` is never populated (MutationObserver is the real mechanism) and `const { observedAttributes } = C` is never used | 196, 418 |
| B4 | `getNestedProperty` is module-private and unreferenced — delete; also remove its section from `src/methods/README.md` | 824-856 |
| B5 | Duplicate `const propName = kebabToCamelCase(name)` (computed at 491 and re-declared at 514/517); no-op `.replace(/\./g, '.')` — both fall out of the A2 fix | 486-519 |
| B6 | Commented-out blocks: SSR `globalThis` shim (48-55), `isLightDom` (859-868), `ElementAttributes1`/commented type variants (550-561) — delete or move rationale to docs | various |
| B7 | `normalizeAttributeName` (`utils/string.ts`) and `normalizePropertyPath` (`utils/nested.ts`) are line-for-line identical — keep one, re-export/delete the other | utils |
| B8 | `isJsx` (jsx-runtime) vs `isJsxProp` (`methods/is_jsx_prop.ts`) are the same `SYMBOL_JSX in props` predicate — consolidate to one exported symbol | both |

---

## 4. Findings — structural simplification (one refactor per commit, suite green between each)

### C1. Extract shared render helper — biggest win in `custom_element.ts`

The `SYMBOL_CONTEXT` branch (322-358) and the `renderInto` branch (360-397) are ~90% identical: clear pending wrap → `createElement` → (unwrap loop, pending A3 verdict) → `setChild(shadowRoot ?? this, ...)` → capture pending wrap into `SYMBOL_CONTEXT_WRAP`. Extract:

```ts
const renderComponent = (host, shadowRoot, component, props, wrapFn?) => {
    const doRender = () => {
        consumePendingContextWrap()
        const componentResult = createElement(component, props)
        setChild(shadowRoot ?? host, componentResult, FragmentUtils.make(), callStack('Custom element'))
        const pendingWrap = consumePendingContextWrap()
        if (pendingWrap) host[SYMBOL_CONTEXT_WRAP] = pendingWrap
    }
    wrapFn ? wrapFn(doRender) : doRender()
}
```

The provider branch then becomes `renderInto(fn => context({[sym]: ps.value}, fn))` plus its `selfWrap` baseline assignment. Preserves ordering exactly; ~40 lines removed.

### C2. Single type-conversion helper

The `attribute string → typed value` logic exists **three times**: the big `switch` in `setObservableValue` (690-749), the reactive-bridge effect body (645-654), and static mode (666-676). Extract `applyConverted(obs, value)`:

```ts
const applyConverted = (obs, value) => {
    const options = obs[SYMBOL_OBSERVABLE_WRITABLE]?.options
    const { type, fromHtml } = options ?? {}
    if (fromHtml) return obs(fromHtml(value))
    obs(builtinConvert(type, value))   // number/boolean/bigint/object/symbol/undefined/default
}
```

Note every `case` in the current switch is already `fromHtml ? fromHtml(v) : <builtin>` — the switch collapses to a small `builtinConvert`. Also extract the "resolve context ref and bind/bridge" block so the A1 fix reuses it.

### C3. Dedupe `collectAncestorContextWrap`

Identical implementations in `custom_element.ts:162-177` and `context_ref.ts:80-93` (the copy exists to avoid a circular import). Move to `src/utils/context_wrap.ts` (utils → constants only; no cycle) and import from both.

### C4. Flatten `resolveContextRef` repetition

Three near-identical "run `context(symbol)` inside a wrap, then apply isStatic unwrap" blocks (`context_ref.ts:180-247`). Extract:

```ts
const readVia = (wrap) => { let v; wrap ? wrap(() => v = context(symbol)) : v = context(symbol); return v }
const finish = (v) => isStatic && isObservable(v) ? $$(v) : v
```

Then the two strategy orders become two short arrays of sources tried in sequence. Keep the strategy-order comments — they encode hard-won invariants.

---

## 5. Findings — optimizations (measure before/after; lowest priority)

- **D1. `refreshStylesheetCache()` per element construction** (`custom_element.ts:309`): forces a full stylesheet re-scan for *every* HTML-created element. `observeStylesheetChanges()` (module init, line 567) already watches for stylesheet mutations. Change to read the cache and rely on the observer to invalidate; keep a forced refresh only on first construction if the Tailwind-CDN timing issue (see comment) reproduces. Measure: construct 200 elements, compare total constructor time.
- **D2. `propDict` per instance** (402-409): key set comes from `defaultPropsFn()` and is identical for every instance of a class — build once as a lazy static on `C`.
- **D3. `CONTEXTS_DATA.set(Context, ...)` on every Provider render** (`create_context.tsx:72`): mutates a global map per render, and `isStatic` is last-writer-wins across *all* providers of the same context — two providers with different `static` props corrupt each other's `useContext` unwrap behavior. Set the entry once in `createContext` (already done at line 109) and store `isStatic` per-provider (e.g. alongside the value in the context payload) instead of per-context. This is a semantic fix disguised as an optimization — write a test with two sibling providers, one `static`, one not.
- **D4. `ContextProvider` return value** (`create_context.tsx:35-37`): `Object.assign(context(...), { symbol })` throws or silently no-ops when the resolved children are a primitive/frozen value or array. Guard with `isObject` check before assigning.

---

## 6. Execution plan (step-by-step)

**Phase 0 — baseline.** Resolve the working tree: implement A7 option (b) (add the mismatch warning to `mergeInto`), add the A7 type test, run the full playground suite, commit the `mergeInto` change. Record baseline: `dv2 console --type error` = 0, count of ✅ markers.

**Phase 1 — dead code batch (B1-B8).** One commit. Rebuild, rerun suite, expect identical ✅ count. Update `src/methods/README.md` for B4.

**Phase 2 — bug fixes.**
1. A4 (one-liner) → suite.
2. A2 (delete dual write) → suite; specifically the nested-prop and style tests.
3. A1 (style context refs) → new playground test `TestStyleContextRef.tsx` first (red), then fix (green).
4. A3: run the verification experiment. If double-invocation confirmed, remove the unwrap loops, full suite with special attention to `TestContextComponents`, slotted-provider chains, and `@`-ref tests. If not confirmed, document why the loop exists in a comment and close.
5. A5: ask maintainer / check git history intent (`git log -S "populate defaults" -- src/methods/custom_element.ts`); act accordingly.

**Phase 3 — refactors C1-C4.** One per commit, full suite green between each. C2 before C1 is fine too; keep A1's shared resolver in mind when doing C2.

**Phase 4 — optimizations D1-D4.** D3 first (it is really a correctness fix — write the two-sibling-providers test). D1/D2 only with a before/after measurement in the commit message. A6 last.

**Definition of done per phase:** `pnpm build` clean, dev server restarted if soby changed, `dv2 console --type error` empty, ✅ count ≥ baseline, no new ❌/ASSERT, changed behavior covered by a playground test that fails on the old code.

---

## 7. Key files quick reference

| File | Role |
|------|------|
| `src/methods/custom_element.ts` | CE class factory, attribute↔observable sync, context replay capture |
| `src/methods/context_ref.ts` | `@`-prefix registry + resolution strategy (constructor vs connected) |
| `src/methods/create_context.tsx` | `createContext`, invisible JSX Provider, `<context-provider>` element |
| `src/hooks/use_context.ts` | ambient read + isStatic unwrap |
| `src/methods/defaults.ts` / `make.ts` | default-prop factory, prop observable-wrapping |
| `src/utils/nested.ts` / `string.ts` | path/case normalization (B7 duplication) |
| `src/constants.ts` | `SYMBOL_CONTEXT`, `SYMBOL_CONTEXT_WRAP`, `SYMBOL_JSX`, `CONTEXTS_DATA` |
| `demo/playground/src/Test*.tsx` | in-browser test suite (auto-runs on load) |
| `docs/doc/CONTEXT_API.md`, `CUSTOM_ELEMENTS.md` | user-facing docs — update after Phase 2/3 |
