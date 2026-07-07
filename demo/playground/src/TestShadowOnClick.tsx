/**
 * Test Shadow DOM Custom Element with onClick Handler
 *
 * Verifies onClick fires exactly once per click when wired through a custom element.
 * The fix: handleClick calls e.stopPropagation() so woby's event delegation loop
 * (which walks composedPath() through shadow DOM) doesn't also fire the host
 * element's _onclick handler after handleClick already called onClick() explicitly.
 */
import { $, $$, customElement, defaults, type JSX, useEffect } from 'woby'
import { registerTestObservable } from './util'

const name = 'TestShadowOnClick'

// Custom element that accepts onClick prop
// onClick is NOT reactive — plain function or null, no $() wrapper
const ClickableElement = defaults(
    () => ({
        label: $('Click Me'),
        onClick: null as (() => void) | null,
    }),
    ({ label, onClick, children }) => {
        const handleClick = (e: Event) => {
            // CRITICAL: stop propagation so woby's document-level delegation loop
            // (composedPath walk) doesn't fire clickable-element._onclick AGAIN
            // after we already call onClick() explicitly below.
            e.stopPropagation()

            if (typeof onClick === 'function') {
                onClick()
            }
        }
        return (
            <div style={{
                padding: '16px',
                border: '2px solid green',
                borderRadius: '8px',
                margin: '8px 0',
                backgroundColor: '#f0f8f0'
            }}>
                <h3>{label}</h3>
                <button onClick={handleClick}>Click Me</button>
                {children}
            </div>
        )
    }
)

customElement('clickable-element', ClickableElement)

// Test component
const TestShadowOnClick = (): JSX.Element => {
    // callCount tracks how many times the handler fires — should be exactly 1
    const callCount = $(0)
    const testStatus = $<'pending' | 'pass' | 'fail'>('pending')
    let testRan = false

    // Handler defined inside component so it can increment callCount
    const handler = () => {
        callCount(c => c + 1)
        console.log(`[${name}] handler called, total: ${callCount()}`)
    }

    useEffect(() => {
        if (testRan) return
        testRan = true

        const el = document.querySelector('clickable-element')
        const button = el?.querySelector('button') as HTMLButtonElement
        if (!button) {
            console.warn(`[${name}] button not found`)
            testStatus('fail')
            return
        }

        button.click()

        setTimeout(() => {
            const count = callCount()
            console.log(`[${name}] call count after click: ${count} (expected 1)`)
            testStatus(count === 1 ? 'pass' : 'fail')
        }, 50)
    })

    return (
        <div>
            <h1>Custom Element onClick Wiring</h1>

            <p>Verifies onClick fires exactly once (stopPropagation fix)</p>

            <clickable-element label="Click Me (External)" onClick={handler} />

            <p>Call count: {callCount}</p>
            <p>Status: <strong style={{ color: () =>
                $$(testStatus) === 'pass' ? 'green' :
                $$(testStatus) === 'fail' ? 'red' : 'orange'
            }}>{testStatus}</strong></p>
        </div>
    )
}

// Register component for SSR testing
registerTestObservable(`${name}_ssr`, TestShadowOnClick)

// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    const { testObservables } = await import('./util')
    const { renderToString } = await import('woby')

    // Execute component to register the SSR observable
    TestShadowOnClick()

    const ssrComponent = testObservables[`TestShadowOnClick_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestShadowOnClick\n   SSR: ${ssrResult} ✅\n`)
    }
}

export default TestShadowOnClick
