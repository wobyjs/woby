/**
 * Test Custom Element with Slots
 * 
 * Tests slot functionality in custom elements:
 * - Default slot content
 * - Named slots
 * - Slot fallback content
 * - Slot content distribution
 */
import { $, $$, customElement, defaults, HtmlString } from 'woby'

// Custom element with slot support
const SlotElement = defaults(() => ({
    title: $('Slot Element', HtmlString),
    showFallback: $(false)
}), ({ title, showFallback, children }) => {
    return (
        <div style={{ border: '2px solid purple', padding: '15px', margin: '10px' }}>
            <h3>{$$(title)}</h3>

            {/* Slot container */}
            <div style={{ backgroundColor: '#f0f0f0', padding: '10px', margin: '5px 0' }}>
                {children ? children : (
                    $$(showFallback) ?
                        <p style={{ color: 'gray' }}>Fallback content when no children provided</p> :
                        null
                )}
            </div>

            <p>End of slot element</p>
        </div>
    )
})

// Custom element with named slots concept (using data attributes)
const NamedSlotElement = defaults(() => ({
    header: $('Default Header'),
    footer: $('Default Footer')
}), ({ header, footer, children }) => {
    // Extract named content from children
    const headerContent = () => {
        const childArray = Array.isArray($$(children)) ? $$(children) : [$$(children)]
        return childArray.find(child => child?.props?.['data-slot'] === 'header') || $$(header)
    }

    const footerContent = () => {
        const childArray = Array.isArray($$(children)) ? $$(children) : [$$(children)]
        return childArray.find(child => child?.props?.['data-slot'] === 'footer') || $$(footer)
    }

    const mainContent = () => {
        const childArray = Array.isArray($$(children)) ? $$(children) : [$$(children)]
        return childArray.filter(child =>
            !child?.props?.['data-slot'] ||
            (child?.props?.['data-slot'] !== 'header' && child?.props?.['data-slot'] !== 'footer')
        )
    }

    return (
        <div style={{ border: '2px solid orange', padding: '15px', margin: '10px' }}>
            <header style={{ backgroundColor: '#ffeecc', padding: '5px', marginBottom: '10px' }}>
                {headerContent()}
            </header>

            <main style={{ backgroundColor: '#eeffee', padding: '10px', margin: '10px 0' }}>
                {mainContent()}
            </main>

            <footer style={{ backgroundColor: '#ffeeee', padding: '5px', marginTop: '10px' }}>
                {footerContent()}
            </footer>
        </div>
    )
})

// Register custom elements
customElement('slot-element', SlotElement)
customElement('named-slot-element', NamedSlotElement)

// Test component
const TestCustomElementSlots = () => {
    const showFallback = $(true)
    const headerText = $('Custom Header')
    const footerText = $('Custom Footer')

    return (
        <div>
            <h1>Custom Element Slots Test</h1>

            {/* Basic slot test */}
            <h2>1. Basic Slot Functionality</h2>
            <slot-element title="Element with Children">
                <p>This content goes into the slot</p>
                <button>Slot Button</button>
            </slot-element>

            <slot-element title="Element without Children" showFallback={showFallback} />

            {/* TSX slot usage */}
            <h2>2. TSX Slot Usage</h2>
            <SlotElement title="TSX Slot Test">
                <div>
                    <p>TSX-provided slot content</p>
                    <ul>
                        <li>Item 1</li>
                        <li>Item 2</li>
                    </ul>
                </div>
            </SlotElement>

            {/* Named slots concept */}
            <h2>3. Named Slots Concept</h2>
            <named-slot-element header={headerText} footer={footerText}>
                <div data-slot="header">
                    <h4>Custom Header Content</h4>
                </div>
                <p>Main content area</p>
                <p>More main content</p>
                <div data-slot="footer">
                    <em>Custom Footer Content</em>
                </div>
            </named-slot-element>

            {/* Mixed usage with slots */}
            <h2>4. Mixed Usage with Slots</h2>
            <SlotElement title="Outer Element">
                <slot-element title="Nested Slot Element">
                    <p>Nested slot content</p>
                </slot-element>
            </SlotElement>
        </div>
    )
}

export default TestCustomElementSlots