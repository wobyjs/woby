/**
 * Test Custom Element Basic Functionality
 * 
 * Tests basic custom element creation and usage with:
 * - Default props
 * - Attribute binding
 * - Style properties
 * - Nested properties
 * - Type conversion
 */
import { $, $$, customElement, defaults, HtmlString, HtmlNumber, HtmlBoolean } from 'woby'

// Define a simple custom element with basic props
const BasicElement = defaults(() => ({
    title: $('Basic Element', HtmlString),
    count: $(0, HtmlNumber),
    active: $(false, HtmlBoolean),
    color: $('blue')
}), ({ title, count, active, color, children }) => {
    return (
        <div style={{
            border: '2px solid ' + $$(color),
            padding: '10px',
            backgroundColor: $$(active) ? '#e0e0e0' : 'white'
        }}>
            <h2>{$$(title)}</h2>
            <p>Count: {$$(count)}</p>
            <p>Active: {$$(active) ? 'Yes' : 'No'}</p>
            <div>{children}</div>
        </div>
    )
})

// Register the custom element
customElement('basic-element', BasicElement)

// Test component
const TestCustomElementBasic = () => {
    const title = $('Test Element')
    const count = $(42)
    const active = $(true)
    const color = $('green')

    return (
        <div>
            <h1>Custom Element Basic Test</h1>

            {/* TSX usage */}
            <h2>1. TSX Usage</h2>
            <BasicElement
                title={title}
                count={count}
                active={active}
                color={color}
            >
                <p>This is child content from TSX</p>
            </BasicElement>

            {/* Custom element usage */}
            <h2>2. Custom Element Usage</h2>
            <basic-element
                title="HTML Attribute Title"
                count="100"
                active="true"
                color="red"
                style$margin-top="20px"
            >
                <p>This is child content from HTML</p>
            </basic-element>

            {/* Mixed usage */}
            <h2>3. Mixed Usage</h2>
            <BasicElement title="Mixed TSX">
                <basic-element title="Nested Custom Element" count="50">
                    <p>Nested content</p>
                </basic-element>
            </BasicElement>
        </div>
    )
}

export default TestCustomElementBasic