/**
 * Test HTML onclick on web component
 * 
 * Pattern: use dangerouslySetInnerHTML with HTML string to render
 * sibling to TSX custom element tests.
 * 
 * Tests:
 * 1. HTML onclick="..." attribute on custom element
 * 2. Can onclick access element properties via this?
 * 3. JS onclick assignment
 */
import { $, $$, customElement, defaults, HtmlFunction, type JSX, renderToString, HtmlNumber } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert } from './util'

const name = 'TestHtmlOnClick'

// Custom element with properties
const WebBtn = defaults(
    () => ({
        label: $('Web Button'),
        value: $(0, HtmlNumber),
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

// Test component using dangerouslySetInnerHTML
const TestHtmlOnClick = (): JSX.Element => {
    const html = `
        <div>
            <h3>HTML onclick on Web Component</h3>
            
            <h2>Test 1: HTML onclick attribute</h2>
            <web-btn 
                id="test1"
                label="HTML onclick" 
                value="10"
                onclick="const current = parseInt(this.getAttribute('value') || '0'); const next = current + 1; this.setAttribute('value', next); this.querySelector('p').textContent = 'Value: ' + next;"
            />
            <p style="font-size: 12px; color: #666;">
                Click to increment value attribute and update DOM
            </p>

            <h2>Test 2: JS onclick assignment</h2>
            <web-btn 
                id="test2"
                label="JS onclick" 
                value="20"
            />
            <p style="font-size: 12px; color: #666;">
                Click to test: can we read/write this.value in JS onclick?
            </p>
        </div>
    `

    const ret: JSX.Element = () => (
        <div dangerouslySetInnerHTML={{ __html: html }} />
    )

    registerTestObservable(`${name}_ssr`, ret)
    return ret
}

// SSR test
if (typeof window === 'undefined') {
    TestHtmlOnClick()
    const ssrComponent = testObservables[`${name}_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: ${name}\n   SSR: ${ssrResult.substring(0, 200)}... ✅\n`)
    }
}

// This is a visual/manual test - no automated assertions
// The component renders HTML onclick on a web component
// Click the button to verify the onclick handler works

export default () => <TestHtmlOnClick />
