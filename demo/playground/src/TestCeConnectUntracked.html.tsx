/**
 * Repro for su-yen HANDOFF-compass-hang.md.
 *
 * connectedCallback fires synchronously inside whichever effect inserted the element. Its
 * prop→attribute reflection and attribute replay used to READ each prop observable tracked and
 * then WRITE the re-parsed attribute back into it. For a prop whose attribute round-trip is not
 * `equals`-stable — a Date with no HtmlDate (toUTCString drops ms, and the result is a new
 * value) — that write stales the inserting effect, which rebuilds the element, which connects
 * and writes again: an unbounded render loop (compass froze for ~60s, ~4,900 root re-runs).
 *
 * Browser-only (.html.tsx): the element must connect to a live document inside the effect.
 */
import { $, $$, customElement, defaults, type JSX } from 'woby'
import { assert } from './util'

const name = 'TestCeConnectUntracked'

// Mirrors wui's DateTimeWheeler defaults: plain $(Date), deliberately NO HtmlDate.
const DateEl = defaults(
    () => ({
        value: $(new Date(2000, 0, 1)),
        minDate: $(new Date(1900, 0, 1)),
        maxDate: $(new Date()),
    }),
    ({ value }) => <span class="cecu-value">{() => String($$(value))}</span>
)

customElement('ce-connect-untracked-el', DateEl)

// Cap so a regression reports a failure instead of freezing the whole suite.
const MAX_RUNS = 20

const TestCeConnectUntracked = (): JSX.Element => {
    const show = $(false)
    let runs = 0

    const drive = (host: HTMLElement): void => {
        // Flip after mount, so the reactive child below inserts — and the element connects —
        // while its own render effect is running against a live document.
        setTimeout(() => {
            runs = 0
            show(true)

            setTimeout(() => {
                const el = host.querySelector('ce-connect-untracked-el')
                const mounted = !!el?.isConnected
                assert(mounted, `[${name}] the custom element did not mount`)

                const once = runs === 1
                assert(once, `[${name}] inserting a CE with non-round-trippable Date props re-ran the inserting effect ${runs}× (expected 1${runs > MAX_RUNS ? `, hit the ${MAX_RUNS} cap — render loop` : ''})`)

                if (mounted && once)
                    console.log(`✅ [${name}] connectedCallback's attribute sync does not subscribe the inserting effect to the CE's props`)
            }, 200)
        }, 100)
    }

    return (
        <div ref={(el: any) => el && drive(el)}>
            <h3>CE connect inside an effect (untracked)</h3>
            {() => {
                if (!$$(show)) return null
                if (++runs > MAX_RUNS) return null
                return (
                    <ce-connect-untracked-el
                        value={$(new Date(2000, 0, 1, 0, 0, 0, 123))}
                        minDate={new Date(1900, 0, 1)}
                        maxDate={new Date()}
                    />
                )
            }}
        </div>
    )
}

export default () => <TestCeConnectUntracked />
