/**
 * customElement() with a component that was NOT wrapped in defaults().
 *
 * Registration used to log "Component <tag> is missing default props", every JSX use of the
 * tag logged it again, and constructing the element then threw `defaultPropsFn is not a
 * function` — so the console.error was really the prelude to a crash. A props-less (or
 * plain-props) component is a legitimate custom element: it should construct, render, and
 * receive whatever JSX props / HTML attributes it was given as plain values.
 *
 * Browser-only (.html.tsx): needs the native customElements upgrade path.
 */
import { customElement, type JSX } from 'woby'
import { assert } from './util'

const name = 'TestCeNoDefaults'

// Deliberately no defaults(): props arrive as plain values.
const Plain = ({ label }: { label?: string }) => <span class="cend-label">{label ?? 'none'}</span>

customElement('ce-no-defaults', Plain as any)

declare module 'woby' {
    namespace JSX {
        interface IntrinsicElements {
            'ce-no-defaults': { label?: string }
            'ce-no-defaults-typed': { label?: string; count?: number; flag?: boolean }
        }
    }
}

// Regression for: connectedCallback replayed the host's own just-written attribute
// string through attributeChangedCallback1, which stringified any non-observable
// JSX-supplied prop that wasn't already a string (count: 42 -> "42", flag: true ->
// "true") the instant the element connected.
const Typed = ({ label, count, flag }: { label?: string; count?: number; flag?: boolean }) =>
    <span class="cend-label">{`${label ?? 'none'}:${count}:${flag}`}</span>

customElement('ce-no-defaults-typed', Typed as any)

const TestCeNoDefaults = (): JSX.Element => {
    const drive = (host: HTMLElement): void => {
        setTimeout(() => {
            // JSX-created elements render into light DOM; HTML-upgraded ones into a shadow root.
            const read = (el: Element | null | undefined) =>
                ((el as any)?.shadowRoot ?? el)?.querySelector('.cend-label')?.textContent

            // JSX path
            const jsxText = read(host.querySelector('.cend-jsx ce-no-defaults'))
            assert(jsxText === 'from-jsx', `[${name}] JSX-created element should render its plain prop: expected 'from-jsx', got '${jsxText}'`)

            // Typed-prop path: a number/boolean JSX prop must survive connectedCallback's
            // attribute replay without being coerced to its stringified attribute form.
            const typedEl = host.querySelector('.cend-jsx ce-no-defaults-typed') as any
            const typedCount = typedEl?.props?.count
            const typedFlag = typedEl?.props?.flag
            assert(typeof typedCount === 'number' && typedCount === 42,
                `[${name}] JSX number prop must stay a number after connect: expected 42 (number), got ${JSON.stringify(typedCount)} (${typeof typedCount})`)
            assert(typeof typedFlag === 'boolean' && typedFlag === true,
                `[${name}] JSX boolean prop must stay a boolean after connect: expected true (boolean), got ${JSON.stringify(typedFlag)} (${typeof typedFlag})`)

            // HTML path: an element that already carries its attribute when the native
            // constructor upgrades it (importNode of parsed markup).
            const htmlHost = host.querySelector('.cend-html') as HTMLElement
            let threw: unknown = null
            try {
                const parsed = new DOMParser().parseFromString('<ce-no-defaults label="from-html"></ce-no-defaults>', 'text/html')
                htmlHost.appendChild(document.importNode(parsed.body.firstElementChild!, true))
            } catch (e) {
                threw = e
            }
            assert(!threw, `[${name}] upgrading an HTML element threw: ${threw}`)

            setTimeout(() => {
                const htmlText = read(htmlHost.querySelector('ce-no-defaults'))
                assert(htmlText === 'from-html', `[${name}] HTML-created element should render its attribute: expected 'from-html', got '${htmlText}'`)

                if (jsxText === 'from-jsx' && !threw && htmlText === 'from-html' &&
                    typeof typedCount === 'number' && typedCount === 42 && typeof typedFlag === 'boolean' && typedFlag === true)
                    console.log(`✅ [${name}] a custom element without defaults() constructs and renders its props (JSX + HTML), typed props stay typed`)
            }, 50)
        }, 50)
    }

    return (
        <div ref={(el: any) => el && drive(el)}>
            <h3>Custom element without defaults()</h3>
            <div class="cend-jsx">
                <ce-no-defaults label="from-jsx" />
                <ce-no-defaults-typed label="from-jsx" count={42} flag={true} />
            </div>
            <div class="cend-html" />
        </div>
    )
}

export default () => <TestCeNoDefaults />
