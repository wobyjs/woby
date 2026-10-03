import { $, $$, customElement, defaults, useEffect, type JSX } from 'woby'
import { assert, registerTestObservable } from './util'

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

    // Auto-test: fire click and verify counter increments. <ClickBtnExternal> is used as a
    // component here (not the <click-btn-external> tag), so look the button up inside this
    // test's own wrapper rather than by tag name across the document.
    const externalHost = $<HTMLElement>()

    useEffect(() => {
        // These assertions drive real clicks, so they are browser-only; the Node SSR
        // runner has no document and the effect would throw after the render check.
        if (typeof document === 'undefined') return
        const host = $$(externalHost)
        if (!host) return

        // Wait a macrotask so the subtree is attached and woby's delegated listener is live.
        setTimeout(() => {
            const button = host.querySelector('button') as HTMLButtonElement | null
            assert(!!button, `[${name}] external handler button not rendered`)
            if (!button) {
                testStatus('fail')
                return
            }

            const initial = externalCount()
            button.click()

            setTimeout(() => {
                const after = externalCount()
                const ok = after === initial + 1
                assert(ok, `[${name}] onClick prop not triggered: count ${initial} -> ${after}`)
                testStatus(ok ? 'pass' : 'fail')
                if (ok) console.log(`✅ [${name}] external onClick prop handler triggered (${initial} -> ${after})`)
            }, 50)
        }, 0)
    })

    return (
        <div>
            <h1>Woby onClick Wiring Test</h1>

            <h3>Method 1: Internal Handler (defined inside)</h3>
            <ClickBtnInternal />

            <h3>Method 2: External Handler (passed as prop)</h3>
            <div ref={externalHost}>
                <ClickBtnExternal label="Click Me (External)" onClick={handleExternalClick} />
            </div>

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
