/**
 * Manual test for onClick wiring
 */
import { $, $$, customElement, defaults, HtmlFunction, render } from 'woby'

// Simple custom element with onClick prop
const ClickBtn = defaults(
    () => ({
        label: $('Click'),
        onClick: $(null as [Function] | undefined, HtmlFunction),
    }),
    ({ label, onClick }) => {
        return (
            <div style={{ padding: '16px', border: '2px solid green', borderRadius: '8px' }}>
                <h3>{label}</h3>
                <button onClick={onClick as any}>Click Me</button>
            </div>
        )
    }
)

customElement('click-btn', ClickBtn)

// Test
const count = $(0)
const handleClick = $$((e: MouseEvent) => {
    count(count() + 1)
    console.log('✅ [ManualTest] Clicked! Count:', count())
})

const App = () => (
    <div>
        <h1>Manual onClick Test</h1>
        <p>Count: {count}</p>
        <click-btn label="Test Button" onClick={handleClick} />
        <p style={{ marginTop: '16px', color: '#666' }}>
            Click the button above. Check console for "Clicked! Count:" message.
        </p>
    </div>
)

render(<App />, document.getElementById('app')!)
