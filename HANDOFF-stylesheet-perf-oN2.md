# Handoff — Custom-Element Stylesheet Reconversion O(N²) Hang

**Status:** Root-caused, fix **APPLIED and confirmed** (awaiting full regression test).

**Confirmed result (2026-07-20, dv1 re-profile of 宫格.html):** `convertAllDocumentStylesToConstructed` dropped from **7000 ms (30.8%) → 340 ms (2.2%)**; the full stylesheet subsystem fell from **~62% → ~4%** of load. Warm-cache page load ~14.5 s (down from ~22.7 s CPU-pegged), now dominated by unrelated dev-mode overhead (see §8). NOTE: the *first* navigation after a dev-server restart is slow (~85 s, ~84% idle) — that is Vite cold-transforming the out-of-root `/@fs/` woby module graph on demand, a one-time cost, not the bug. Profile the *second* load.
**Date:** 2026-07-20
**Component:** `@woby/woby` custom-element base class + stylesheet utils
**Severity:** High — multi-second to multi-minute main-thread lockup on **every** page that mounts more than a handful of custom elements. Framework-wide, not app-specific.

---

## 1. Symptom

All QMDJ visual pages (`http://localhost:7314/visual/components/*.html`) load extremely slowly — the renderer main thread is fully pegged (synchronous lockup) for tens of seconds up to minutes on heavier pages. The page eventually renders; it is a very long **finite** synchronous computation, not an infinite loop.

Key signal: it is **not one page** — every page is affected, and heavier pages (more custom-element instances) are disproportionately worse. That points at a **shared** framework path, not app code.

---

## 2. Evidence (CPU profile)

Profiled the *lighter* `宫格.html` page (≈140 `<sy-宫格>` instances) via CDP `Profiler` on a fresh tab, sampling at 200 µs, enabling the profiler on `about:blank` **before** navigating (so domain-enable does not block on the already-pegged renderer).

```
==== TOTAL profiled: 22718 ms, samples: 36967 ====
   7000.1 ms  30.8%  convertAllDocumentStylesToConstructed  src/utils/stylesheets.ts
   3784.4 ms  16.7%  (anon, <style> loop callback)          src/utils/stylesheets.ts:~82
   3081.1 ms  13.6%  (program)
   2602.0 ms  11.5%  (anon, shadow-root reassign)           src/utils/stylesheets.ts:~256
   2178.9 ms   9.6%  (idle)
   1187.7 ms   5.2%  Stack                                  @woby/soby debugger.js
    485.4 ms   2.1%  eLon                                   lunar-typescript (unrelated, small)
    129.4 ms   0.6%  RegExp @property\s+([\w-]+)\s*\{...\}   (the @property extractor)
    ... (app code — 排盘/宫格/count干支 — is negligible, <0.5% each)
```

**~62% of the entire page load is inside one shared woby function**, `convertAllDocumentStylesToConstructed`, plus its inner `<style>`-loop callback, the `@property` regex, and the shadow-root reassignment. **App code (排盘.tsx reactive charts, count干支, etc.) barely registers** — this is *not* a reactive loop and *not* the chart math.

Profiler script used: `scratchpad/cdp-profile2.mjs` (fresh-tab variant; connects only to the dv1 Chrome on port 9230).

---

## 3. Root cause

### 3a. The cache is defeated on every element connect

`src/methods/custom_element.ts` — in the connect path of **every** non-`ignoreStyle`, non-`three-*` custom element:

```ts
// custom_element.ts:304-316
const ignoreStyle = (this.props as any).ignoreStyle === true
if (!ignoreStyle) {
    // Force refresh the cache to ensure we get the latest styles
    // This is important for dynamically loaded stylesheets like Tailwind CDN
    const allSheets = refreshStylesheetCache()          // ← line 308  (THE BUG)
    shadowRoot.adoptedStyleSheets = allSheets
    registerShadowRoot(shadowRoot)
}
```

`refreshStylesheetCache()` (`src/utils/stylesheets.ts:342`) **unconditionally nukes the cache**, then does a full reconversion:

```ts
export function refreshStylesheetCache(): CSSStyleSheet[] {
    cachedConstructedSheets = null                       // blows away the cache
    return convertAllDocumentStylesToConstructed()       // full re-parse of ALL document CSS
}
```

So the `cachedConstructedSheets` guard at `stylesheets.ts:80-83` is **useless during page load**. Every element mount re-does the full work:

1. walk **all** `<style>` tags (`document.querySelectorAll('style')`),
2. walk **all** `document.styleSheets`,
3. regex-extract `@property` rules from each (`extractPropertyRules`), and
4. `new CSSStyleSheet().replaceSync(...)` over the **entire Tailwind v4 dev stylesheet** (very large in dev mode).

That is **O(N × total-CSS-size)** for N custom elements — already bad at N≈140 with a big Tailwind sheet.

### 3b. The MutationObserver makes it O(N²)

`observeStylesheetChanges()` (`stylesheets.ts:188`, armed once at `custom_element.ts:544`) installs a `MutationObserver` on `document.head` with `subtree:true, characterData:true`. During load, Vite/`@woby/wui` inject `<style>` tags continuously. Each injection:

```ts
cachedConstructedSheets = null
updateAllShadowRoots()   // → refreshStylesheetCache() → full reconvert
                         //   → reassign adoptedStyleSheets to EVERY registered shadow root
```

So as element *k* connects, a concurrent style injection triggers a full reconvert **and** a re-push to all *k* already-registered roots. Summed over N connects this is **≈ O(N²)** reassignments plus repeated full CSS re-parses. This is the tail that turns tens of seconds into minutes on the heaviest pages (e.g. `奇门盘首.html`, 8 full charts → hundreds of nested cells).

### Why "all pages": both paths live in the custom-element base class, so they run for every `sy-*` element on every page. Cost scales with instance count × CSS size.

---

## 4. Proposed fix (one line)

Use the **cached** converter on element connect instead of the cache-busting one:

```diff
--- a/src/methods/custom_element.ts
+++ b/src/methods/custom_element.ts
@@ -305,7 +305,7 @@
     if (!ignoreStyle) {
-        // Force refresh the cache to ensure we get the latest styles
-        // This is important for dynamically loaded stylesheets like Tailwind CDN
-        const allSheets = refreshStylesheetCache()
+        // Use the cached conversion; the MutationObserver (observeStylesheetChanges)
+        // already invalidates the cache when a real <style>/<link> mutation happens.
+        const allSheets = convertAllDocumentStylesToConstructed()
         shadowRoot.adoptedStyleSheets = allSheets
         registerShadowRoot(shadowRoot)
     }
```

Import change in the same file (top, line ~37):

```diff
-import { observeStylesheetChanges, refreshStylesheetCache, registerShadowRoot, unregisterShadowRoot } from "../utils/stylesheets"
+import { observeStylesheetChanges, convertAllDocumentStylesToConstructed, registerShadowRoot, unregisterShadowRoot } from "../utils/stylesheets"
```

(`refreshStylesheetCache` may remain exported/used elsewhere; only this call site changes.)

**Effect:** the first element pays the parse cost once; the remaining N−1 hit the cache. N full re-parses → 1. Expected to collapse the ≈22 s (宫格) to well under a second, and the multi-minute heavy pages to a couple seconds.

### Why it stays correct
- Genuine stylesheet changes are still handled: `observeStylesheetChanges()`'s `MutationObserver` sets `cachedConstructedSheets = null` and calls `updateAllShadowRoots()` whenever a real `<style>`/`<link>` is added/removed or a `<style>`'s text changes. So dynamically-loaded styles (Tailwind CDN, HMR, runtime `<style>` injection) still propagate to all shadow roots — just once per actual change instead of once per element mount.
- The original comment ("important for dynamically loaded stylesheets") is satisfied by the observer, not by per-connect cache-busting.

---

## 5. Regression test plan (please run full)

Environment: `pnpm dev --port 7314` in `su-yen/packages/qmdj`, Chrome via dv1 (port 9230). `@woby/woby` is served from source over Vite `/@fs/`, so HMR picks up the edit **without a rebuild**. (If you consume a built `@woby/woby` elsewhere, rebuild it: check `su-yen/packages/qmdj` resolves woby to `D:/Developments/tslib/@woby/woby/src` — it does in dev.)

### 5a. Performance (the win)
- [ ] Re-profile `宫格.html` with `scratchpad/cdp-profile2.mjs` → total load should drop from ~22 s to sub-second; `convertAllDocumentStylesToConstructed` should appear **once**, not dominate.
- [ ] Load `奇门盘首.html` (heaviest, 8 charts) → should go from multi-minute to a few seconds.
- [ ] Spot-check 2-3 other `visual/components/*.html` pages for load time.

### 5b. Visual correctness — styles MUST still apply inside shadow DOM
This is the risk surface. Verify Tailwind + theme variables render identically to before on:
- [ ] `宫格.html` — all 11 sections: palace colors, `框` direction labels, `中格` watermarks, 阳遁/阴遁 color themes (`--outter`, `--内盘宫`, `--line`, `--内盘字` CSS vars resolve inside shadow DOM).
- [ ] `九宫.html` — full 3×3 grid styling.
- [ ] `奇门盘首.html` / the full `奇门遁甲chart.html` — 盘首 + 盘宫 + 九宫 + 奇门细节 panel all themed correctly.
- [ ] Any page using `@property`-based Tailwind v4 utilities — confirm the `:host` variable fallback still injected (colors that depend on `@property --tw-*` don't break).
- [ ] Compass pages (`sy-compass.html`, `compass.qm`, `compass.8m`) if they use the same base class — confirm CSS3D/WebGL ring text still styled.

### 5c. Dynamic stylesheet changes still propagate (the observer path)
- [ ] Trigger an HMR CSS edit (touch a `.css`/Tailwind class in a source file) while a page is open → shadow-DOM'd components should restyle without reload.
- [ ] Programmatically append a `<style>` to `document.head` in the console → confirm existing shadow roots pick it up (`updateAllShadowRoots` fires). E.g.:
      ```js
      const s = document.createElement('style'); s.textContent = 'body{}'; document.head.appendChild(s)
      ```
      No error, no perf regression.
- [ ] Late-mounted custom element (added after initial load, e.g. via a toggle) still receives current styles.

### 5d. No functional regressions
- [ ] `dv1 console --type error` clean on each page (no new errors/warnings from the change).
- [ ] `pnpm test` / the `bazi-test` sweep unaffected (this change is render-path only; should be zero blast radius on logic tests — but confirm the harness still runs; see memory `test-harness-wui-exports-resolution` for the known-broken-harness trap).
- [ ] `ignoreStyle` elements and `three-*` elements unchanged (they never entered this branch).

### 5e. Rollback
Single-file, two-line revert: restore the import and `const allSheets = refreshStylesheetCache()` at `custom_element.ts:308`. No data/schema/state migration involved.

---

## 6. Files

| File | Role |
|---|---|
| `src/methods/custom_element.ts:308` | **The fix site** (`refreshStylesheetCache()` → `convertAllDocumentStylesToConstructed()`) + import at `:37` |
| `src/utils/stylesheets.ts:79` | `convertAllDocumentStylesToConstructed` (cached) |
| `src/utils/stylesheets.ts:342` | `refreshStylesheetCache` (cache-busting; leave as-is, other callers may exist) |
| `src/utils/stylesheets.ts:188` | `observeStylesheetChanges` — the MutationObserver that keeps the cache correct after the fix |
| `su-yen/packages/qmdj/scratchpad/cdp-profile2.mjs` | fresh-tab CDP profiler used to gather §2 (dv1 / port 9230 only) |

---

## 7. Notes / open questions for reviewer
- Confirm no other caller depends on the **side effect** of `custom_element.ts:308` busting the cache on every mount (grep shows the only intra-woby callers are here + the observer). If some downstream consumer relied on per-mount freshness, the observer already covers real changes — but flag if you know of a case that mutates `document.styleSheets` *without* a DOM mutation the observer can see (e.g. `sheet.insertRule()` on an existing sheet — the observer would NOT catch that; the old code would, by accident, on the next element mount). If that pattern exists, add an explicit `refreshStylesheetCache()` at that mutation site instead of taxing every mount.
- Sampling profiler line numbers are ±a few lines (dev TS source-map); the function-level attribution is exact.

---

## 8. Residual load cost after the fix (secondary, dev-only — NOT this bug)

Post-fix warm-cache profile of `宫格.html` (15.6 s profiled, ~14.5 s load) top frames:

```
   5753.9 ms  36.8%  (program)                              — dev module eval/parse (woby served from source, not bundled)
   2868.5 ms  18.3%  (idle)                                 — network waits on individual /@fs/ module fetches
   2041.9 ms  13.1%  Stack  @woby/soby/dist/methods/debugger.js:16   — soby reactivity DEV stack-capture on every observable op
    627.6 ms   4.0%  eLon   lunar-typescript                — astronomical calc (app, expected)
    437.8 ms   2.8%  classesToggle  woby/src/utils/classlist.ts:3
    340.7 ms   2.2%  convertAllDocumentStylesToConstructed  ← the fixed path, now negligible
```

These are inherent **dev-mode** costs, all framework-wide, none related to the stylesheet bug:
- `(program)` + `(idle)` — Vite serves each woby source module as a separate transformed request; a production build (bundled/minified) collapses this to near-zero.
- `Stack @ soby debugger.js:16` (13%) — `@woby/soby` captures a stack trace per reactive operation for its dev debugger. Dev-only; gone in prod builds. If it needs addressing, that is a **separate** change in `@woby/soby` (not woby) and should be its own task — do not fold it into this fix.

Recommendation: measure a production build before pursuing these; they likely evaporate. The user's "all pages slow" complaint was the O(N²) stylesheet path, which is now resolved.
