/**
 * Test HTML onclick attribute on web component
 * 
 * Can onclick="console.log(this)" access the custom element?
 * - In HTML: onclick runs in global scope, `this` = element
 * - Custom element properties: accessible via `this.prop`?
 */
import { $, $$, customElement, defaults, HtmlFunction, HtmlString, type JSX, useEffect } from 'woby'
import { registerTestObservable } from './util'

const name = 'TestHtmlOnClick'

// Custom element with properties
const WebBtn = defaults(
    () => ({
        label: $('Web Button'),
        value: $(0, Number),
        onClick: $(null as [Function] | undefined, HtmlFunction),
    }),
    ({ label, value, onClick }) => {
        return (
            <div style={{ padding: '16px', border: '2px solid blue', borderRadius: '8px', margin: '8px 0' }}>
                <h3>{label}</h3>
                <p>Value: {value}</p>
                <button onClick={onClick as any}>Click via HtmlFunction</button>
            </div>
        )
    }
)

customElement('web-btn', WebBtn)

// Test component
const TestHtmlOnClick = (): JSX.Element => {
    const log = $([] as string[])

    useEffect(() => {
        if (typeof document === 'undefined') return
        // Test 1: Can HTML onclick access the element?
        const el1 = document.querySelector('#test1') as any
        if (el1) {
            console.log(`[${name}] Test 1: HTML onclick="..."`)
            console.log(`  Element:`, el1)
            console.log(`  Has label property?`, el1.label)
            console.log(`  Has value property?`, el1.value)
        }

        // Test 2: Can we set onclick via JS and access properties?
        const el2 = document.querySelector('#test2') as any
        if (el2) {
            el2.onclick = function(this: HTMLElement, e: MouseEvent) {
                console.log(`[${name}] JS onclick fired`)
                console.log(`  this:`, this)
                console.log(`  this.label:`, (this as any).label)
                console.log(`  this.value:`, (this as any).value)
                
                // Can we modify the element's state?
                if (typeof (this as any).value === 'number') {
                    (this as any).value = ((this as any).value ?? 0) + 1
                    console.log(`  Updated value to:`, (this as any).value)
                }
            }
        }
    })

    return (
        <div>
            <h1>HTML onclick on Web Component</h1>
            
            <h2>Test 1: HTML onclick attribute</h2>
            <web-btn 
                id="test1"
                label="HTML onclick" 
                value={10}
                // HTML string onclick - runs in global scope
                // @ts-ignore
                onclick="console.log('HTML onclick:', this, 'label:', this.getAttribute('label'), 'value:', this.getAttribute('value'))"
            />
            <p style={{ fontSize: '12px', color: '#666' }}>
                Check console: does `this.label` work?
            </p>

            <h2>Test 2: JS onclick assignment</h2>
            <web-btn 
                id="test2"
                label="JS onclick" 
                value={20}
            />
            <p style={{ fontSize: '12px', color: '#666' }}>
                Click to test: can we read/write `this.value`?
            </p>

            <h2>Test 3: HtmlFunction onClick</h2>
            <web-btn 
                label="HtmlFunction" 
                value={30}
                onClick={$$(() => console.log(`[${name}] HtmlFunction onClick works!`))}
            />
        </div>
    )
}

// Register component for SSR testing
registerTestObservable(`${name}_ssr`, TestHtmlOnClick)

// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    const { testObservables } = await import('./util')
    const { renderToString } = await import('woby')

    TestHtmlOnClick()

    const ssrComponent = testObservables[`TestHtmlOnClick_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestHtmlOnClick\n   SSR: ${ssrResult} ✅\n`)
    }
}

export default TestHtmlOnClick
