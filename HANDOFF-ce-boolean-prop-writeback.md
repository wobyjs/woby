# Handoff: a custom-element boolean prop can never be set to `false` — woby writes the construction-time value back

**Filed from:** `su-yen` monorepo, `packages/八字` (settings panel ⇄ chart). woby `2.0.168`.
**Severity:** High — user-facing. A boolean setting bound to a `customElement` prop **cannot be turned off**: the switch flips, the observable goes `false`, and woby immediately writes `true` back. Every "off" is silently undone.
**Status:** **FIXED in woby 2.0.169.** The downstream readonly-projection workaround in 八字 can now be reverted — see the last section.

> **How it was fixed — provenance, not inference.** The report's "preferred" Fix 1 (infer *we removed it* from `toHtml(current) === undefined`) was **not** taken: it also suppresses legitimate restores. Counter-example — a prop declared `$(true, HtmlBoolean)` on an element authored `<el flag="false">` has no reflection effect at all (`connectedCallback` skips `setProp` when the attribute is already present), so a user `removeAttribute('flag')` must restore `true`; Fix 1 would see `toHtml(false) === undefined` and skip it.
>
> The report's **"Alternative"** was implemented instead. `src/utils/setters.ts` exports `trackSelfRemovedAttributes` / `consumeSelfRemovedAttribute` over a per-element `Map<attr, count>` keyed by `SYMBOL_SELF_REMOVED_ATTRIBUTES`; `setAttributeStatic` marks immediately before `removeAttribute`, and the `newValue === null` branch of `attributeChangedCallback1` returns early when it can consume a mark. Three details are load-bearing: **counts rather than a flag** (the observer fires once per mutation record), a **`hasAttribute` guard when marking** (removing an already-absent attribute produces no record, so the mark would become a phantom that swallows a later *user* removal), and **`.clear()` in `connectedCallback`** (reflection effects keep running across disconnect and their removals produce no record for the newly installed observer).
>
> Report Fix 2 also applied: `mergeInto` now reads `SYMBOL_OBSERVABLE_WRITABLE ?? SYMBOL_OBSERVABLE_READABLE`, so readonly projections stop being warned as prop type `"none"`.
>
> **Why the playground never caught it:** every CE boolean in the suite was either declared `$(false, HtmlBoolean)` — restoring `false` over `false` is a no-op — or set once from a static literal and never written again. `TestAttrRemovalRestoresDefault` covers the same `newValue === null` branch, but drives removal from *outside*, which is the direction the branch was built for. Regression test added: `demo/playground/src/TestCeBooleanPropWriteback.html.tsx`, pinning both directions including the `<el flag="false">` counter-case above.
>
> **Scope correction to this report:** the trigger is not specifically "a JSX-provided observable". It is *a live reflection effect for the prop* + *the old value reflects to a present attribute* + *the new value reflects to none*. A component toggling its own declared `$(true, HtmlBoolean)` reproduced identically.

> ⚠️ This is a **regression introduced by `HANDOFF-attr-removal-typed-observable.md`** (the `_propDefaults` snapshot + the `newValue === null` branch in `attributeChangedCallback1`). That fix is correct and must stay. The bug is that the null branch cannot tell a *user-initiated* `removeAttribute` from *woby's own attribute reflection*. Read that handoff before touching this code; its test cases must keep passing.

---

## Symptom

A consumer owns a writable observable, passes it to a `customElement` by JSX, and toggles it from elsewhere in the app:

```tsx
import { $, $$, customElement, defaults, HtmlBoolean } from 'woby'

// a shared singleton — the settings panel and the chart both hold this same observable
export const 英 = $(true, HtmlBoolean)        // construction-time value is TRUE

const Chart = defaults(() => ({ 英: $(false, HtmlBoolean) }), (props) =>
    <div>{() => $$(props.英) ? 'English' : '中文'}</div>)
customElement('x-chart', Chart)

// elsewhere
<x-chart 英={英} />
<input type="checkbox" checked={英} onChange={e => 英(e.target.checked)} />
```

Unchecking the box never turns English off. Traced on the consumer's observable, **one** click produces two writes:

```
[true]          initial
[false]         the consumer's write
[true]          woby writes it back    ← the bug
```

Live evidence from 八字 before the workaround: flipping the `英` switch off left `sy-四柱八字[英] === "true"` and 6 visible English labels on screen; the switch itself sprang back to checked. Zero console errors — nothing looks wrong, the value simply refuses to change.

**Which props are affected:** any prop whose value **at CE construction time** reflects to an attribute, and whose new value reflects to *no attribute*. In practice: booleans that start `true`. A boolean that starts `false` is benign (it is already its own default). Enums, numbers and strings are safe — their reflection is always a non-empty string, so the attribute never disappears.

**Decisive experiment.** Deleting the snapshot makes the writeback vanish, with nothing else changed:

```js
delete document.querySelector('x-chart')._propDefaults['英']
// now unchecking the box sticks
```

---

## Root cause

Whole chain lives in `src/methods/custom_element.ts` plus the reflection helper in `src/utils/setters.ts`.

1. **`custom_element.ts:250`** — `mergeInto` stores the JSX-provided observable **by identity**: `defaultProps[key] = incoming`. Deliberate and correct: snapshotting (`obs($$(incoming))`) would sever the reactive link to the consumer.

2. **`custom_element.ts:290–294`** — right after the merge, every writable prop is snapshotted:

   ```ts
   for (const key in this.props) {
       const obs = (this.props as any)[key]
       if (isObservable(obs) && isObservableWritable(obs))
           this._propDefaults[key] = untrack(() => obs())
   }
   ```

   Because of step 1 this snapshots the **consumer's current value** (`true`), not the component's declared default (`false`). `_propDefaults['英'] = true`.

3. **Reflection removes the attribute.** `createElement`'s `setProp` reflects the observable onto the host element. For a typed observable `setAttribute` (`src/utils/setters.ts:87–100`) runs `options.toHtml(value)`; `HtmlBoolean.toHtml(false)` is **`undefined`** (`src/html/html-boolean.ts:10`), and `setAttributeStatic` (`src/utils/setters.ts:65–68`) calls `element.removeAttribute()` for anything nil. An **untyped** `$(false)` reaches the same line via the explicit `value === false` test — identical outcome.

4. **The MutationObserver reports woby's own removal back in.** `connectedCallback`'s `_attrObserver` (`custom_element.ts:471–490`) observes `{ attributes: true }` on the host and forwards every change: `this.attributeChangedCallback1(name, oldValue, null)`.

5. **`custom_element.ts:537–566`** — the `newValue === null` branch reads "attribute absent" as "prop unset" and restores the snapshot **into the consumer's observable**:

   ```ts
   } else if (newValue === null) {
       const obs = props[propName]
       if (isObservable(obs) && isObservableWritable(obs)) {   // :544 — the only guard
           if (propName in this._propDefaults) {
               const d = this._propDefaults[propName]
               if (typeof d === 'function') obs(() => d)
               else obs(d)                                     // :551–552 — writes `true` back
   ```

   `:544` only asks "is this writable?" Nothing distinguishes *a user removed the attribute* from *we just removed it ourselves because the value became falsy*. So `false` → removeAttribute → observer → restore `true`, and the loop closes.

The earlier guard at `:529–532` (don't clobber an object-valued observable with a stringified attribute) does not help: the current value here is a boolean, not an object.

---

## Expected behaviour

- Writing `false` to a boolean prop's observable leaves it `false`. One write in, one write out.
- A **user-initiated** `el.removeAttribute(name)` still restores the declared default — the entire point of `HANDOFF-attr-removal-typed-observable.md`. No regression there.
- Woby's own attribute reflection is never mistaken for an external mutation.

---

## Suggested fix

### Preferred — in the null branch, skip the restore when the attribute's absence already agrees with the observable

The removal is only meaningful if the observable's **current** value would reflect to a *present* attribute. If the current value reflects to "no attribute", the DOM is already consistent and restoring `_propDefaults` would fight the value the consumer just set. Insert at the top of the `newValue === null` branch (`custom_element.ts:537`), before the `isObservable(obs) && isObservableWritable(obs)` test:

```ts
} else if (newValue === null) {
    const obs = props[propName]

    // The removal may be OUR OWN reflection, not an external mutation: setProp →
    // setAttributeStatic calls removeAttribute whenever the reflected value is nil or
    // `false` (HtmlBoolean.toHtml(false) === undefined), and the MutationObserver reports
    // that straight back here. If the observable's CURRENT value reflects to "no
    // attribute", the DOM already agrees with the prop and there is nothing to restore —
    // restoring _propDefaults would overwrite the value the consumer just wrote.
    if (isObservable(obs)) {
        const cur = untrack(() => obs())
        const opts = (obs[SYMBOL_OBSERVABLE_WRITABLE] as any)?.options as ObservableOptions<any> | undefined
        const reflected = opts?.toHtml ? opts.toHtml(cur) : cur
        if (reflected === undefined || reflected === null || reflected === false) return
    }

    if (isObservable(obs) && isObservableWritable(obs)) {
        // …unchanged…
```

`untrack` is required — this runs inside a MutationObserver callback that must not subscribe to anything.

The check must use the **current** value, not `oldValue`: by the time the observer drains, `obs()` already holds the newly written `false`.

Why this does not regress the wui editor case: `HtmlClass.toHtml` is `toClassString` (`src/html/html-class.ts:67`), which returns `''` for empty input and never `undefined`/`null`/`false`. So for `cls` the guard never fires and the declared default is still restored. Same for `HtmlString` (`toString`). It fires only for `HtmlBoolean`'s `false`, `HtmlNumber`'s `NaN`, and untyped falsy values — exactly the cases where woby is the remover.

### Alternative — record the reflection on the reflecting side

If inferring from the converter feels too indirect, make `setAttributeStatic` record what it wrote (per element, per attribute) and have the null branch consult that: if the last value woby itself reflected for this attribute was nil/`false`, the removal was ours. A one-shot boolean flag around `removeAttribute` will **not** work — MutationObserver callbacks are microtasks and drain after the synchronous flag would have been cleared; the record has to persist until the observer reads it.

### Fix 2 (cosmetic, independent) — readonly observables falsely reported as a type mismatch

`custom_element.ts:245–249` reads the incoming observable's options off the **writable** symbol only:

```ts
const consumerOpts = (obs?.[SYMBOL_OBSERVABLE_WRITABLE] as any)?.options
const incomingOpts = (incoming[SYMBOL_OBSERVABLE_WRITABLE] as any)?.options
if (consumerOpts?.type && consumerOpts.type !== incomingOpts?.type) console.warn(`[woby] prop "${key}" type mismatch: …`)
```

A `useMemo` observable carries `SYMBOL_OBSERVABLE_READABLE` and has no writable symbol, so `incomingOpts` is `undefined`, `consumerOpts.type` (`Boolean`) `!== undefined`, and woby warns `type mismatch … has type "none"` for a perfectly well-typed readonly projection. Because that projection is currently the **only** way to dodge the bug above, woby warns about the workaround for its own defect. Fix:

```ts
const incomingOpts = ((incoming[SYMBOL_OBSERVABLE_WRITABLE] ?? incoming[SYMBOL_OBSERVABLE_READABLE]) as any)?.options as ObservableOptions<any> | undefined
```

`SYMBOL_OBSERVABLE_READABLE` is already exported from soby (`soby/src/index.ts:79`); `custom_element.ts:30` currently imports only the writable one. The same two-symbol read would suit `:698–699` (`@ref.val` mismatch) but that path is not implicated here.

### Independent of the fix chosen

Reading a readonly observable is the structural escape hatch (`:544` skips it because there is no writable symbol), and that must keep working — it is what downstream code is relying on right now.

---

## Suggested tests

New, for this bug:

1. **Boolean prop, shared writable observable, construction-time `true`.** `const flag = $(true, HtmlBoolean)`; mount `<x-el flag={flag} />`; `flag(false)`; flush; assert `$$(flag) === false` **and** `el.hasAttribute('flag') === false`. Currently `flag` is back to `true`.
2. **No double write.** Subscribe to the consumer's observable, record every value, do one `flag(false)`. Expect `[true, false]`, not `[true, false, true]`.
3. **Untyped observable.** Same as (1) with `$(true)` and no `HtmlBoolean`. Covers the `value === false` branch of `setAttributeStatic` rather than the `toHtml` branch.
4. **Off → on → off.** Three flips must all land; the bug reappears on any subsequent flip if only the first is fixed.
5. **Number prop reflecting to nothing.** `$(NaN, HtmlNumber)` — `HtmlNumber.toHtml` returns `undefined` for NaN (`src/html/html-number.ts:15–18`), so it is the same shape.
6. **Readonly projection still exempt.** `<x-el flag={useMemo(() => $$(src))} />` must not warn (Fix 2) and must not be written to.

Must keep passing (from `HANDOFF-attr-removal-typed-observable.md`):

7. **User-initiated removal of a string/class prop restores the default.** `el.setAttribute('cls', 'a b')`; `el.removeAttribute('cls')` → `props.cls()` is the declared default, not stale `'a b'`, and no throw.
8. **Non-empty declared default.** `inputType: $('text', HtmlString)`; set to `'password'`, then remove → `'text'`.
9. **`$(undefined, HtmlClass)`** — removal falls through to `emptyValueFor` (`:563`) without throwing.
10. **Boolean prop genuinely on, then removed by the user.** `flag` holds `true`, `el.removeAttribute('flag')` → the guard must NOT fire (`toHtml(true) === ''`, not nil) and the default is restored.

Plus the standing playground gate: `globalThis.__passLogCount` > 1500 and `globalThis.__testFailures.length === 0`.

---

## Verification cost

- Rebuild **woby** only; soby is untouched by both fixes.
- woby is served to consumers over `/@fs/`, so **every dev server in every dependent repo must be restarted** — Vite caches the transform and HMR will not pick it up.
- Re-run the playground suite (`demo/playground`, port outside 5xxx) and check the two globals above.
- Downstream smoke test: any app with a settings panel wired to a CE boolean. In 八字 it is the `英` switch in `<sy-八字设置>` against `<sy-四柱八字>`.

---

## Downstream workaround (revert once this is fixed)

`packages/八字` currently strips write capability before handing a switch to a CE, so `:544` skips the restore:

- `packages/八字/src/八字Ctx.tsx` — module-level `只读` (single readonly projection via `useMemo(() => $$(o))`) and `只读开关` (project the named keys of a spread object), plus a ~25-line comment in `useAllBaziData` documenting the mechanism. `useAllBaziData` step 2 projects all 16 `HtmlBoolean` flags.
- `packages/八字/src/八字App.tsx` — `只读开关(use大运, ['英', '零运', '十神', '藏干', '空亡', '神煞', '卦象', '纳音', '长生', '流年'])` before the spread onto `<sy-大运盘>`.

Both should go back to plain destructuring once woby stops writing back. The projection also costs reactive write-through in the other direction, which these CEs do not need but a future consumer might.

Also still valid and must stay valid: `@woby/wui`'s `src/Editor/PropertyExtractor.ts` uses plain `el.removeAttribute(attr)` (its own workaround was reverted when `HANDOFF-attr-removal-typed-observable.md` was fixed).

---

## Reference line numbers (at time of filing — woby 2.0.168)

| file | line | what |
|---|---|---|
| `src/methods/custom_element.ts` | 30 | soby import — `SYMBOL_OBSERVABLE_READABLE` needs adding for Fix 2 |
| `src/methods/custom_element.ts` | 198, 203 | `_attrObserver`, `_propDefaults` fields |
| `src/methods/custom_element.ts` | 245–249 | type-mismatch warn — **Fix 2** |
| `src/methods/custom_element.ts` | 250 | `defaultProps[key] = incoming` — observable stored by identity |
| `src/methods/custom_element.ts` | 290–294 | `_propDefaults` snapshot — captures the consumer's `true` |
| `src/methods/custom_element.ts` | 471–490 | `_attrObserver` MutationObserver — reports woby's own removal |
| `src/methods/custom_element.ts` | 529–532 | existing object-clobber guard (does not cover booleans) |
| `src/methods/custom_element.ts` | 537–566 | `newValue === null` branch — **Fix 1** goes at the top |
| `src/methods/custom_element.ts` | 544 | the only guard: `isObservable && isObservableWritable` |
| `src/methods/custom_element.ts` | 551–552 | the writeback itself |
| `src/methods/custom_element.ts` | 654–655 | `emptyValueFor` fallback |
| `src/utils/setters.ts` | 65–68 | `setAttributeStatic` — `isNil(value)` or `value === false` → `removeAttribute` |
| `src/utils/setters.ts` | 87–100 | `setAttribute` — reactive `toHtml` reflection path |
| `src/html/html-boolean.ts` | 10 | `toHtml: (v) => is(v) ? '' : undefined` |
| `src/html/html-number.ts` | 15–18 | `toHtml` returns `undefined` for NaN |
| `src/html/html-class.ts` | 67 | `toHtml: toClassString` — never nil, so the guard never fires for `cls` |
| `soby/src/index.ts` | 79 | `SYMBOL_OBSERVABLE_READABLE` is exported |
