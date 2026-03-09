/**
 * Test Custom Element with Slots
 * 
 * Tests slot functionality in custom elements:
 * - Default slot content
 * - Named slots
 * - Slot fallback content
 * - Slot content distribution
 */
import { $, $$, customElement, defaults, ElementAttributes, HtmlBoolean, HtmlNumber, HtmlString, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'


// Define a simple custom element with basic props
const BasicElement = defaults(() => ({
    title: $('Basic Element', HtmlString),
    count: $(0, HtmlNumber),
    active: $(false, HtmlBoolean),
    color: $('blue')
}), ({ title, count, active, color, children }) => {
    // When children are projected through slots (HTML usage), don't render children div
    // When children come from props (JSX usage), render the children div
    // Since all custom elements now use shadow DOM, we need to distinguish
    const isSlotProjected = false // Default to JSX usage behavior

    return (
        <div style={{
            border: '2px solid ' + $$(color),
            padding: '10px',
            backgroundColor: $$(active) ? '#e0e0e0' : 'white'
        }}>
            <h2>{$$(title)}</h2>
            {!isSlotProjected && <div>{children}</div>}
            <p>Count: {$$(count)}</p>
            <p>Active: {$$(active) ? 'Yes' : 'No'}</p>
        </div>
    )
})

// Register the custom element
customElement('basic-element', BasicElement)

// Augment JSX.IntrinsicElements to include custom element
declare module 'woby' {
    namespace JSX {
        interface IntrinsicElements {
            'basic-element': ElementAttributes<typeof BasicElement>
        }
    }
}

// // Custom element with slot support
// const SlotElement = defaults(() => ({
//     title: $('Slot Element', ""),
//     showFallback: $(false)
// }), ({ title, showFallback, children }) => {
//     return (
//         <div style={{ border: '2px solid purple', padding: '15px', margin: '10px' }}>
//             <h3>{$$(title)}</h3>

//             {/* Slot container */}
//             <div style={{ backgroundColor: '#f0f0f0', padding: '10px', margin: '5px 0' }}>
//                 {children ? children : (
//                     $$(showFallback) ?
//                         <p style={{ color: 'gray' }}>Fallback content when no children provided</p> :
//                         null
//                 )}
//             </div>

//             <p>End of slot element</p>
//         </div>
//     )
// })

// // Custom element with named slots concept (using data attributes)
// const NamedSlotElement = defaults(() => ({
//     header: $('Default Header'),
//     footer: $('Default Footer')
// }), ({ header, footer, children }) => {
//     // Extract named content from children
//     const headerContent = () => {
//         const childArray = Array.isArray($$(children)) ? $$(children) : [$$(children)]
//         return childArray.find(child => child?.props?.['data-slot'] === 'header') || $$(header)
//     }

//     const footerContent = () => {
//         const childArray = Array.isArray($$(children)) ? $$(children) : [$$(children)]
//         return childArray.find(child => child?.props?.['data-slot'] === 'footer') || $$(footer)
//     }

//     const mainContent = () => {
//         const childArray = Array.isArray($$(children)) ? $$(children) : [$$(children)]
//         return childArray.filter(child =>
//             !child?.props?.['data-slot'] ||
//             (child?.props?.['data-slot'] !== 'header' && child?.props?.['data-slot'] !== 'footer')
//         )
//     }

//     return (
//         <div style={{ border: '2px solid orange', padding: '15px', margin: '10px' }}>
//             <header style={{ backgroundColor: '#ffeecc', padding: '5px', marginBottom: '10px' }}>
//                 {headerContent()}
//             </header>

//             <main style={{ backgroundColor: '#eeffee', padding: '10px', margin: '10px 0' }}>
//                 {mainContent()}
//             </main>

//             <footer style={{ backgroundColor: '#ffeeee', padding: '5px', marginTop: '10px' }}>
//                 {footerContent()}
//             </footer>
//         </div>
//     )
// })

// // Register custom elements
// customElement('slot-element', SlotElement)
// customElement('named-slot-element', NamedSlotElement)

// Test component is defined in the SSR version below

const TestCustomElementSlotsWithSSR = (): JSX.Element => {
    const showFallback = $(true)
    const headerText = $('Custom Header')
    const footerText = $('Custom Footer')

    const ret: JSX.Element = () => (
        <div>
            <h1>Custom Element Slots Test</h1>


            {/* Basic slot test */}
            <h2>1. Basic Slot Functionality</h2>
            <div dangerouslySetInnerHTML={{
                __html: `<basic-element
                title="Pure HTML Custom Element"
                count="75"
                active="true"
                color="purple"
            >
                <p>This is child content from pure HTML custom element</p>
            </basic-element>` }} />
        </div>
    )

    // Store the component for SSR testing
    registerTestObservable('TestCustomElementSlots_ssr', ret)

    return ret
}



TestCustomElementSlotsWithSSR.test = {
    static: true,
    expect: () => {
        const expected = '<h1>Custom Element Slots Test</h1><h2>1. Basic Slot Functionality</h2><slot-element title="Element with Children"><p>This content goes into the slot</p><button>Slot Button</button></slot-element><slot-element title="Element without Children" showFallback=""></slot-element><h2>2. TSX Slot Usage</h2><slot-element title="TSX Slot Test"><div><p>TSX-provided slot content</p><ul><li>Item 1</li><li>Item 2</li></ul></div></slot-element><h2>3. Named Slots Concept</h2><named-slot-element header="Custom Header" footer="Custom Footer"><div data-slot="header"><h4>Custom Header Content</h4></div><p>Main content area</p><p>More main content</p><div data-slot="footer"><em>Custom Footer Content</em></div></named-slot-element><h2>4. Mixed Usage with Slots</h2><slot-element title="Outer Element"><slot-element title="Nested Slot Element"><p>Nested slot content</p></slot-element></slot-element>'

        const ssrComponent = testObservables['TestCustomElementSlots_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h1>Custom Element Slots Test</h1><h2>1. Basic Slot Functionality</h2><slot-element title="Element with Children"><p>This content goes into the slot</p><button>Slot Button</button></slot-element><slot-element title="Element without Children" showFallback=""></slot-element><h2>2. TSX Slot Usage</h2><slot-element title="TSX Slot Test"><div><p>TSX-provided slot content</p><ul><li>Item 1</li><li>Item 2</li></ul></div></slot-element><h2>3. Named Slots Concept</h2><named-slot-element header="Custom Header" footer="Custom Footer"><div data-slot="header"><h4>Custom Header Content</h4></div><p>Main content area</p><p>More main content</p><div data-slot="footer"><em>Custom Footer Content</em></div></named-slot-element><h2>4. Mixed Usage with Slots</h2><slot-element title="Outer Element"><slot-element title="Nested Slot Element"><p>Nested slot content</p></slot-element></slot-element>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestCustomElementSlots] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestCustomElementSlots] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}

export default () => <TestSnapshots Component={TestCustomElementSlotsWithSSR} />