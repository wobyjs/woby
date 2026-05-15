/**
 * Test Shadow DOM with attachShadow() and onClick
 * 
 * Tests the specific case where onClick is wired to a button
 * INSIDE a real shadow DOM (created with attachShadow).
 * This is where the onClick bug was documented.
 */
import { $, $$, customElement, defaults, type JSX, useEffect } from 'woby'
import { registerTestObservable, assert } from './util'

const name = 'TestRealShadowOnClick'

// Custom element with REAL shadow DOM (not defaults light DOM)
class RealShadowElement extends HTMLElement {
    private shadow: ShadowRoot
    private count: number = 0

    constructor() {
        super()
        // Create actual shadow DOM
        this.shadow = this.attachShadow({ mode: 'open' })
        this.render()
    }

    private render() {
        this.shadow.innerHTML = `
            <style>
                :host {
                    display: block;
                    padding: 16px;
                    border: 2px solid purple;
                    border-radius: 8px;
                    margin: 8px 0;
                    background: #f8f0ff;
                }
                h3 { margin: 0 0 8px 0; color: #333; }
                p { margin: 0 0 8px 0; }
                button {
                    padding: 8px 16px;
                    font-size: 14px;
                    cursor: pointer;
                    background: #9b59b6;
                    color: white;
                    border: none;
                    border-radius: 4px;
                }
                button:hover { background: #8e44ad; }
            </style>
            <div>
                <h3>Real Shadow DOM</h3>
                <p>Count: <span id="count">${this.count}</span></p>
                <button id="btn">Click Me</button>
            </div>
        `

        // Wire up the button click
        const btn = this.shadow.getElementById('btn')
        btn?.addEventListener('click', () => {
            this.count++
            this.updateCount()
            console.log(`[${name}] Shadow button clicked! Count: ${this.count}`)
            
            // Dispatch custom event to parent
            this.dispatchEvent(new CustomEvent('shadow-click', { 
                detail: { count: this.count },
                bubbles: true,
                composed: true
            }))
        })
    }

    private updateCount() {
        const countEl = this.shadow.getElementById('count')
        if (countEl) {
            countEl.textContent = String(this.count)
        }
    }

    static get observedAttributes() {
        return ['label']
    }

    attributeChangedCallback(name: string, oldVal: string, newVal: string) {
        if (name === 'label') {
            const h3 = this.shadow.querySelector('h3')
            if (h3) h3.textContent = newVal || 'Real Shadow DOM'
        }
    }
}

// Register native custom element
if (typeof customElements !== 'undefined') {
    customElements.define('real-shadow-element', RealShadowElement)
}

// Test component
const TestRealShadowOnClickComponent = (): JSX.Element => {
    const shadowClickCount = $(0)
    const testStatus = $<'pending' | 'pass' | 'fail'>('pending')
    const message = $('')

    // Listen for custom event from shadow DOM
    useEffect(() => {
        const handler = (e: CustomEvent) => {
            shadowClickCount(e.detail.count)
            console.log(`[Parent] Received shadow-click event! Count: ${e.detail.count}`)
        }

        document.addEventListener('shadow-click', handler as EventListener)
        return () => document.removeEventListener('shadow-click', handler as EventListener)
    })

    // Auto-test
    useEffect(() => {
        const el = document.querySelector('real-shadow-element') as any
        if (!el) {
            console.log(`[${name}] ⚠️  Element not found`)
            return
        }

        const button = el.shadowRoot?.getElementById('btn') as HTMLButtonElement
        if (!button) {
            console.log(`[${name}] ⚠️  Button not found in shadow root`)
            testStatus('fail')
            message('Button not found in shadow root')
            return
        }

        console.log(`[${name}] ✅ Found shadow button`)

        const initialCount = shadowClickCount()
        
        // Click the shadow button
        button.click()

        setTimeout(() => {
            const newCount = shadowClickCount()
            console.log(`[${name}] After click:`, newCount)

            if (newCount === initialCount + 1) {
                console.log(`[${name}] ✅ Shadow DOM click WORKS!`)
                testStatus('pass')
                message('Shadow DOM click event received!')
            } else {
                console.log(`[${name}] ❌ Shadow DOM click FAILED`)
                testStatus('fail')
                message('Event not received')
            }
        }, 50)
    })

    return (
        <div>
            <h1>Real Shadow DOM onClick Test</h1>
            <p>Received click events: {shadowClickCount}</p>
            <p>Status: <strong style={{ color: (() => {
                const s = testStatus()
                return s === 'pass' ? 'green' : s === 'fail' ? 'red' : 'orange'
            })() }}>{testStatus}</strong></p>
            <p>{message}</p>

            {/* Native custom element with shadow DOM */}
            <real-shadow-element label="Shadow Button" />

            <div style={{ marginTop: '16px', padding: '8px', border: '1px dashed gray' }}>
                <p><strong>This tests native Shadow DOM:</strong></p>
                <ul>
                    <li>Uses attachShadow &#123; mode: 'open' &#125;</li>
                    <li>Button is inside shadow root</li>
                    <li>Clicks dispatch custom events through shadow boundary</li>
                    <li>Woby's JSX onClick doesn't work here (native DOM)</li>
                </ul>
            </div>
        </div>
    )
}

// SSR registration
if (typeof window === 'undefined') {
    registerTestObservable(`${name}_ssr`, TestRealShadowOnClickComponent)
}

export default TestRealShadowOnClickComponent
