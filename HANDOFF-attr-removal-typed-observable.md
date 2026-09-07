# Handoff: removing an attribute leaves the prop observable stale (typed observables throw)

**Filed from:** `@woby/wui` (editor property panel — "Class Override" row)
**Severity:** silent data loss in the HTML→prop sync; the component keeps rendering a value the DOM no longer has
**Status:** FIXED in woby (`src/methods/custom_element.ts` — `_propDefaults` snapshot + null branch in `attributeChangedCallback1` + `emptyValueFor` fallback + `try/catch` in `_attrObserver`). The wui workaround has been reverted and the fix re-verified live against the editor property panel; see *Downstream workaround* below.

---

## Symptom

`el.removeAttribute('cls')` on an upgraded woby custom element removes the attribute but does **not** update the element's prop observable. The component goes on rendering the old value forever. No error surfaces to the caller.

Reproduced live on `<wui-avatar>` (Chrome, dev build):

```js
av.setAttribute('cls', 'bg-black')
// after a tick: props.cls() === 'bg-black', shadow root renders bg-black   ✅
av.removeAttribute('cls')
// after a tick: getAttribute('cls') === null
//               props.cls()        === 'bg-black'   ❌ stale
//               shadow root still renders bg-black  ❌
```

Setting the attribute to `''` instead works correctly and reverts the component to its base class, so the bug is specific to *removal*.

## Root cause

1. `src/methods/custom_element.ts:446-458` — the `_attrObserver` maps every attribute mutation to
   `this.attributeChangedCallback1(name, m.oldValue, this.getAttribute(name))`.
   For a removal `this.getAttribute(name)` is **`null`**.

2. `src/methods/custom_element.ts:477` — `attributeChangedCallback1` passes that `null` straight through to
   `setObservableValue(props, propName, newValue, this)` (line 506). Its parameter is typed `value: string`, so `null` is already outside the contract.

3. `src/methods/custom_element.ts:584` — `setObservableValue`, typed branch. `cls` carries `HtmlClass`
   (`src/html/html-class.ts:64-69`), whose `type` is the **`String` constructor** and whose `fromHtml` is a pass-through. `String` matches no `case` in the switch, so control reaches the `default:` at ~line 719:

   ```ts
   default:
       obj[key](fromHtml ? fromHtml(value) : value)   // → obj.cls(null)
   ```

4. `soby/src/objects/observable.ts:61-74` — `set()` type-checks against `options.type`:

   ```ts
   if (expectedType === 'string' || expectedType === String) {
       if (typeof value !== 'string')
           throw new TypeError(`Expected value of type 'string', but received '${typeof value}'`)
   }
   ```

   `typeof null === 'object'` → **throws**.

5. The throw happens inside the `MutationObserver` callback, i.e. on the microtask queue with no caller frame. The observable keeps its previous value and the mutation is lost. Verified directly in the page:

   ```js
   av.props.cls(null)  // TypeError: Expected value of type 'string', but received 'object'
   av.props.cls('')    // ok
   ```

Note the same trap applies to `undefined` and to every other typed prop, not just `HtmlClass`: `HtmlString`, `HtmlNumber` (`typeof null !== 'number'`), `HtmlBigInt`, etc. Untyped observables happen to survive because they just store `null`, which is still wrong semantically — removal should restore the **default**, not `null`.

## Expected behaviour

Removing an attribute should return the prop to the value it had before any attribute was applied — its declared default from the component's `def` object — mirroring how the platform treats a removed attribute as "unset". Failing that, it should at minimum reach the type's empty value (`''` / `0` / `false`) rather than throwing.

## Suggested fix

**Preferred — restore the declared default.** The original default value is currently unrecoverable: `defaultProps` observables are mutated in place, so nothing retains what they held at construction.

1. In the constructor, after `this.props` is settled, snapshot the initial values:
   ```ts
   this._propDefaults = {}
   for (const key in this.props)
       if (isObservableWritable(this.props[key]))
           this._propDefaults[key] = untrack(() => this.props[key]())
   ```
   (`untrack` matters for the same reason it does at line ~736 — this runs inside a render effect.)

2. In `attributeChangedCallback1`, treat removal as its own case before delegating:
   ```ts
   if (newValue === null) {
       const obs = props[propName]
       if (isObservableWritable(obs))
           obs(propName in this._propDefaults ? this._propDefaults[propName] : emptyForType(obs))
       return
   }
   ```

3. Widen `setObservableValue`'s signature to `value: string | null` and make every typed branch null-safe, so a `null` arriving by any other route coerces instead of throwing (`string → ''`, `number → 0` or `NaN`, `boolean → false`, `object → undefined`).

**Minimal variant**, if the snapshot is too invasive for this release: do only step 3. It fixes the throw and gets `cls` back to `''` (which for wui's `$$(cls) ? $$(cls) : BASE` slot contract is equivalent to unset), but it does not restore non-empty declared defaults such as `TextField`'s `inputType: $("text", HtmlString)` — removing `input-type` would leave `''` instead of `"text"`.

**Independent of the fix chosen:** wrap the `attributeChangedCallback1` call inside the `_attrObserver` callback in `try/catch` with a `console.warn`. A throw there is currently invisible, which is what made this take a full debugging session to find rather than a glance at the console.

## Suggested tests

- `el.setAttribute('cls', 'x')` → `props.cls() === 'x'`; `el.removeAttribute('cls')` → `props.cls()` back to the declared default and the shadow-root render reverts.
- Same for a `HtmlNumber` prop and a `HtmlBoolean` prop.
- A prop with a non-empty declared default (`inputType: $("text", HtmlString)`): set, then remove → `"text"`, not `""`.
- Removal of an attribute that was never set → no throw, no change.
- Removal of an attribute on an element created from raw HTML (`innerHTML`) as well as from JSX — the two take different constructor paths.

## Downstream workaround (revert once this is fixed)

`@woby/wui` `src/Editor/PropertyExtractor.ts`, in `applyCustomElementProperty`, now clears a prop by writing an **empty attribute** instead of removing it:

```ts
} else if (value === '' || (spec && value === unset)) {
    if (el.hasAttribute(attr)) el.setAttribute(attr, '')
}
```

**Reverted** — `applyCustomElementProperty` is back to plain `el.removeAttribute(attr)`, which keeps serialized editor HTML tidy.

Re-verified in the editor demo with woby's fix in place (the wui dev server aliases `woby` to `../../@woby/woby/src`, so this exercises the source, not `dist`):

| step | `cls` attribute | `props.cls()` | rendered inner class |
|---|---|---|---|
| override typed | `bg-sky-700 flex items-center justify-center` | same | `rounded-full w-10 h-10 text-base flex items-center justify-center bg-sky-700` |
| Class Override cleared | **`null`** (removed) | **`''`** (declared default restored) | full `BASE_CLASS` + variant/size |
| CSS Class `ring-4 ring-red-500` | host `class` set | — | base + both ring tokens |
| CSS Class cleared | host `class` **`null`** | — | ring tokens gone |

No `[woby] … failed to sync attribute` warnings in the console. `npx tsc --noEmit` clean, `pnpm ssr-test` 45/45, `pnpm build` green.

## Reference line numbers (at time of filing)

| file | line | what |
|---|---|---|
| `src/methods/custom_element.ts` | 446-458 | `_attrObserver` → `attributeChangedCallback1(name, oldValue, getAttribute(name))` |
| `src/methods/custom_element.ts` | 477-506 | `attributeChangedCallback1`, delegates to `setObservableValue` |
| `src/methods/custom_element.ts` | 584 | `setObservableValue(obj, key, value: string, element?)` |
| `src/methods/custom_element.ts` | ~719 | `default:` branch → `obj[key](fromHtml(value))` |
| `src/html/html-class.ts` | 64-69 | `HtmlClass` — `type: String`, `fromHtml` pass-through |
| `node_modules/soby/src/objects/observable.ts` | 61-74 | `set()` type check that throws on `null` |
