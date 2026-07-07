import { $, $$, customElement, defaults, useEffect, type JSX } from 'woby'
import { registerTestObservable } from './util'

const name = 'TestWobyOnClick'

// Method 1: Internal handler (defined INSIDE the component) - WORKS
const ClickBtnInternal = defaults(
    () => ({
        label: $('Click Internal'),
    }),
    ({ label }) => <div style={{ padding: '8px', border: '2px solid green', borderRadius: '8px', margin: '8px 0' }}>
            <h3>{label}</h3>
            <button onClick={() => label($$(label)+'!')}>{label}</button>
        </div>
)

customElement('click-btn-internal', ClickBtnInternal)

// Method 2: Function passed as PROP from consumer
// onClick MUST be in defaults with $(null), consumer MUST assign or it stays null
const ClickBtnExternal = defaults(
    () => ({
        label: $('Click External'),
        onClick: $(null as (() => void) | null),  // MUST not be null when used
    }),
    ({ label, onClick, children }) => {
        const handleClick = () => {
            console.log('[ClickBtnExternal] button clicked')
            // Call the onClick handler passed from parent (same pattern as TestShadowOnClick)
            const fn = (onClick as any)?.()
            if (typeof fn === 'function') {
                fn()
            }
        }
        return <div style={{ padding: '8px', border: '2px solid orange', borderRadius: '8px', margin: '8px 0', backgroundColor: '#fff5f0' }}>
            <h3>{label}</h3>
            <button onClick={handleClick}>{label}</button>
            {children}
        </div>
    }
)

customElement('click-btn-external', ClickBtnExternal)

// Test component
const TestWobyOnClick = (): JSX.Element => {
    const externalCount = $(0)
    const testStatus = $<'pending' | 'pass' | 'fail'>('pending')

    // Handler defined outside - this is what we want to pass
    const handleExternalClick = ((e: MouseEvent) => {
        externalCount(externalCount() + 1)
        console.log(`[${name}] External handler! Count:`, externalCount())
    })

    // Auto-test: fire click and verify counter increments
    useEffect(() => {
        const el = document.querySelector('click-btn-external')
        if (!el) {
            console.log(`[${name}] ⚠️ click-btn-external not found`)
            return
        }

        const button = el.querySelector('button') as HTMLButtonElement
        if (!button) {
            console.log(`[${name}] ⚠️ button not found`)
            testStatus('fail')
            return
        }

        console.log(`[${name}] ✅ Found button, firing click...`)
        const initial = externalCount()

        // Fire click
        button.click()

        // Check after
        setTimeout(() => {
            const after = externalCount()
            console.log(`[${name}] Count: ${initial} -> ${after}`)
            if (after === initial + 1) {
                console.log(`[${name}] ✅ External handler triggered!`)
                testStatus('pass')
            } else {
                console.log(`[${name}] ❌ FAIL - onClick not triggered`)
                testStatus('fail')
            }
        }, 50)
    })

    return (
        <div>
            <h1>Woby onClick Wiring Test</h1>

            <h3>Method 1: Internal Handler (defined inside)</h3>
            <ClickBtnInternal />

            <h3>Method 2: External Handler (passed as prop)</h3>
            <ClickBtnExternal label="Click Me (External)" onClick={handleExternalClick} />

            <p>External Count: {externalCount}</p>
            <p>Status: <strong style={{ color: () =>
                testStatus() === 'pass' ? 'green' :
                testStatus() === 'fail' ? 'red' : 'orange'
            }}>{testStatus}</strong></p>
        </div>
    )
}

// Register component for SSR testing
registerTestObservable(`${name}_ssr`, TestWobyOnClick)

// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    const { testObservables } = await import('./util')
    const { renderToString } = await import('woby')

    // Execute component to register the SSR observable
    TestWobyOnClick()

    const ssrComponent = testObservables[`TestWobyOnClick_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestWobyOnClick\n   SSR: ${ssrResult} ✅\n`)
    }
}

export default TestWobyOnClick
