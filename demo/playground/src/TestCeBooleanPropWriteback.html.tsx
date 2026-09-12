/**
 * Repro for HANDOFF-ce-boolean-prop-writeback.md.
 *
 * A consumer-owned writable observable is handed to a custom element by JSX. Its
 * construction-time value is `true`, which reflects onto the host as an attribute. When the
 * consumer later writes `false`, HtmlBoolean.toHtml(false) is `undefined`, so setAttributeStatic
 * calls removeAttribute — and the host's own MutationObserver reports that removal back into
 * attributeChangedCallback1, whose `newValue === null` branch restores the _propDefaults
 * snapshot (`true`) into the consumer's observable. The write is undone.
 *
 * Browser-only (.html.tsx): MutationObserver and attributeChangedCallback need a real DOM.
 */
import { $, $$, customElement, defaults, useEffect, HtmlBoolean, type JSX } from 'woby'
import { assert } from './util'

const name = 'TestCeBooleanPropWriteback'

const FlagEl = defaults(
    () => ({
        typed: $(false, HtmlBoolean),
        plain: $(false),
    }),
    ({ typed, plain }) => (
        <div>
            <span class="cebpw-typed">{() => String($$(typed))}</span>
            {' / '}
            <span class="cebpw-plain">{() => String($$(plain))}</span>
        </div>
    )
)

customElement('ce-bool-writeback-el', FlagEl)

/**
 * The counter-case, and the reason the fix records what woby itself removed rather than
 * inferring it from the value: here the prop is ALREADY false when the user removes the
 * attribute, and the declared default is `true`. Inferring "this removal was ours" from
 * `toHtml(current) === undefined` would suppress this restore too. Authored in HTML so the
 * attribute is present at connectedCallback and no reflection effect is installed — every
 * removal on this element is genuinely the consumer's.
 */
const RestoreEl = defaults(
    () => ({ flag: $(true, HtmlBoolean) }),
    ({ flag }) => <span class="cebpw-restore">{() => String($$(flag))}</span>
)

customElement('ce-bool-restore-el', RestoreEl)

// Consumer-owned observables. Construction-time value is TRUE for both, which is the
// precondition for the bug: `true` reflects to an attribute, `false` reflects to none.
const typed = $(true, HtmlBoolean)
const plain = $(true)

const typedWrites: any[] = []
const plainWrites: any[] = []

const drive = (el: any): void => {
    useEffect(() => { typedWrites.push($$(typed)) })
    useEffect(() => { plainWrites.push($$(plain)) })

    setTimeout(() => {
        typedWrites.length = 0
        plainWrites.length = 0

        // One consumer write each.
        typed(false)
        plain(false)

        // MutationObserver delivers on the microtask checkpoint; a macrotask is well past it.
        setTimeout(() => {
            const t1 = $$(typed) === false
            assert(t1, `[${name}] typed: after writing false the observable is ${JSON.stringify($$(typed))}, expected false`)

            const p1 = $$(plain) === false
            assert(p1, `[${name}] plain (untyped): after writing false the observable is ${JSON.stringify($$(plain))}, expected false`)

            const a1 = el.hasAttribute('typed') === false
            assert(a1, `[${name}] typed: host still carries attribute typed="${el.getAttribute('typed')}" after the prop went false`)

            const w1 = typedWrites.length === 1 && typedWrites[0] === false
            assert(w1, `[${name}] typed: one consumer write produced ${JSON.stringify(typedWrites)}, expected [false] (a trailing true is the writeback)`)

            // off -> on -> off: the bug reappears on any later flip if only the first sticks.
            typed(true)
            setTimeout(() => {
                typed(false)
                setTimeout(() => {
                    const t2 = $$(typed) === false
                    assert(t2, `[${name}] typed: after off->on->off the observable is ${JSON.stringify($$(typed))}, expected false`)

                    if (t1 && p1 && a1 && w1 && t2)
                        console.log(`✅ [${name}] a JSX-provided boolean prop starting true can be set to false and stays false`)
                }, 100)
            }, 100)
        }, 100)
    }, 100)
}

const driveRestore = (host: HTMLElement): void => {
    host.innerHTML = '<ce-bool-restore-el flag="false"></ce-bool-restore-el>'
    const el = host.querySelector('ce-bool-restore-el') as any

    setTimeout(() => {
        const applied = $$(el.props.flag) === false
        assert(applied, `[${name}] restore: flag="false" in HTML gave ${JSON.stringify($$(el.props.flag))}, expected false`)

        // A user removal while the prop is false must still restore the declared default.
        el.removeAttribute('flag')
        setTimeout(() => {
            const restored = $$(el.props.flag) === true
            assert(restored, `[${name}] restore: removeAttribute left flag at ${JSON.stringify($$(el.props.flag))}, expected the declared default true`)

            if (applied && restored)
                console.log(`✅ [${name}] a user removeAttribute still restores the declared default even when the prop already reflects to nothing`)
        }, 100)
    }, 100)
}

const TestCeBooleanPropWriteback = (): JSX.Element => (
    <div>
        <h3>CE Boolean Prop Writeback</h3>
        <ce-bool-writeback-el typed={typed} plain={plain} ref={(el: any) => el && drive(el)} />
        <div ref={(el: any) => el && driveRestore(el)} />
    </div>
)

export default () => <TestCeBooleanPropWriteback />
