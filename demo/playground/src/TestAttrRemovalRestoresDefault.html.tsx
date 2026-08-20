/**
 * Regression test for HANDOFF-attr-removal-typed-observable.md.
 *
 * `removeAttribute(x)` used to forward `null` straight into the prop observable. A typed
 * observable rejects that outright — soby's set() throws "Expected value of type 'string',
 * but received 'object'" — so the prop kept the attribute's last value and the element stayed
 * visually stale. The throw escaped inside a MutationObserver callback, which also dropped
 * every remaining mutation in the same batch.
 *
 * The fix snapshots each writable prop's pre-attribute value in the constructor and restores
 * that on removal, falling back to the declared type's empty value when the snapshot itself is
 * not assignable.
 *
 * Browser-only (.html.tsx): MutationObserver and attributeChangedCallback need a real DOM, so
 * `pnpm test` skips this file by design.
 */
import { $, $$, customElement, defaults, HtmlBoolean, HtmlClass, HtmlNumber, HtmlString, type JSX } from 'woby'
import { assert } from './util'

const name = 'TestAttrRemovalRestoresDefault'

const AttrRemovalEl = defaults(
    () => ({
        // Typed props with a real default — the snapshot restores directly.
        label: $('Default Label', HtmlString),
        count: $(0, HtmlNumber),
        active: $(false, HtmlBoolean),
        // The shape @woby/wui declares. HtmlClass is `type: String`, and soby accepts
        // `undefined` at construction but rejects it on every later set(), so restoring the
        // recorded default throws and the fallback to the type's empty value ('') has to
        // carry this case.
        cls: $(undefined, HtmlClass),
        // Untyped: nothing validates the write, so the snapshot restores as-is.
        plain: $('blue'),
    }),
    ({ label, count, active, cls, plain }) => (
        <div class={cls as any}>
            <span class="arr-label">{label}</span>
            {' / '}
            <span class="arr-count">{count}</span>
            {' / '}
            <span class="arr-active">{() => String($$(active))}</span>
            {' / '}
            <span class="arr-plain">{plain}</span>
        </div>
    )
)

customElement('attr-removal-el', AttrRemovalEl)

const PROPS = ['label', 'count', 'active', 'cls', 'plain'] as const

const snapshot = (el: any): Record<string, any> => {
    const out: Record<string, any> = {}
    for (const k of PROPS) out[k] = $$(el.props?.[k])
    return out
}

const check = (label: string, actual: Record<string, any>, expected: Record<string, any>): boolean => {
    let ok = true
    for (const k of PROPS)
        if (actual[k] !== expected[k]) {
            assert(false, `[${name}] ${label}: prop "${k}" is ${JSON.stringify(actual[k])}, expected ${JSON.stringify(expected[k])}`)
            ok = false
        }
    return ok
}

const drive = (el: any): void => {
    // The declared defaults, read before any attribute has been applied.
    const declared = snapshot(el)
    check('declared defaults', declared, { label: 'Default Label', count: 0, active: false, cls: undefined, plain: 'blue' })

    setTimeout(() => {
        el.setAttribute('label', 'Overridden')
        el.setAttribute('count', '7')
        el.setAttribute('active', 'true')
        el.setAttribute('cls', 'bg-black')
        el.setAttribute('plain', 'red')

        // MutationObserver delivers on the microtask checkpoint; a macrotask is well past it.
        setTimeout(() => {
            const set = snapshot(el)
            const setOk = check('after setAttribute', set, { label: 'Overridden', count: 7, active: true, cls: 'bg-black', plain: 'red' })

            for (const k of PROPS) el.removeAttribute(k)

            setTimeout(() => {
                const removed = snapshot(el)
                // `cls` lands on '' rather than its `undefined` default: soby rejects a later
                // set(undefined) on a String-typed observable, so the fix falls back to the
                // type's empty value instead of leaving the stale attribute value in place.
                const removedOk = check('after removeAttribute', removed, { label: 'Default Label', count: 0, active: false, cls: '', plain: 'blue' })

                // Removing an attribute that was never set must be a no-op, not a throw.
                el.removeAttribute('never-set-attr')

                setTimeout(() => {
                    const after = snapshot(el)
                    const noopOk = check('after removing an unset attribute', after, removed)

                    if (setOk && removedOk && noopOk)
                        console.log(`✅ [${name}] attribute removal restores each prop to its declared default (typed, untyped, and undefined-default)`)
                }, 100)
            }, 100)
        }, 100)
    }, 100)
}

const TestAttrRemovalRestoresDefault = (): JSX.Element => (
    <div>
        <h3>Attribute Removal Restores Declared Default</h3>
        <attr-removal-el ref={(el: any) => el && drive(el)} />
    </div>
)

export default () => <TestAttrRemovalRestoresDefault />
