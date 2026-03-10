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
    return (
        <div style={{
            border: '2px solid ' + $$(color),
            padding: '10px',
            backgroundColor: $$(active) ? '#e0e0e0' : 'white'
        }}>
            <h2>{$$(title)}</h2>
            <div>{children}</div>
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


const TestCustomElementSlotsWithSSR = (): JSX.Element => {
    const ref=$<HTMLDivElement>()

    //only happen in browser dom, not SSR, not renderToString
    const ret: JSX.Element = () => (
        <div ref={ref}>
            <h1>Custom Element Slots Test</h1>

            <h2>1. Basic Slot Functionality</h2>
            <div dangerouslySetInnerHTML={{
                __html: `<basic-element
                title="Pure HTML Custom Element"
                count="75"
                active="true"
                color="purple"
            >
                <h3>Innner basic-element</h3>
                    <basic-element
                    title="Pure HTML Custom Element nested"
                    count="75"
                    active="true"
                    color="purple"
                    >
                    <p>This is child content from pure nested HTML custom element</p>
                </basic-element>
                <p>Footer</>
            </basic-element>` }} />
        </div>
    )

    // Store the component for SSR testing
    registerTestObservable('TestCustomElementSlots_ref', ret)

    return ret
}

const a =<>
<h1>Custom Element Slots Test</h1>
<h2>1. Basic Slot Functionality</h2>
<div> (dangerouslySetInnerHTML) 
    <basic-element title="Pure HTML Custom Element" count="75" active="true" color="purple">
        <template shadowrootmode="open" shadowrootserializable=""> 
            <div style="border: 2px solid blue; padding: 10px; background-color: white;">
                <h2>Pure HTML Custom Element</h2> (not 'Basic Element')
                <div>
                    <slot>
                        <h3>Innner basic-element</h3> (in shadowRoot)
                        <basic-element title="Pure HTML Custom Element nested" count="75" active="true" color="purple">
                            <template shadowrootmode="open" shadowrootserializable="">
                                <div style="border: 2px solid blue; padding: 10px; background-color: white;">
                                <h2>Pure HTML Custom Element nested</h2> (not 'Basic Element')
                                <h2>Basic Element</h2>
                                    <div>
                                        <slot>  (get .shadowRoot.querySelectorAll('slot')[0].assignedNodes() to populate slot)
                                        <p>This is child content from pure nested HTML custom element</p>
                                            </slot>
                                    </div><p>Count: 0</p><p>Active: No</p></div>
                            </template>
                        
                            </basic-element>
                        <p>Footer</p>
                    </slot>
                </div>
                <p>Count: 0</p>
                <p>Active: No</p></div>
          
        </template>
        </basic-element>
        </div>
        </>

cosnt b =<>
<h1>Custom Element Slots Test</h1>
<h2>1. Basic Slot Functionality</h2>
<div>
    <basic-element title="Pure HTML Custom Element" count="75" active="true" color="purple">
        <template shadowrootmode="open" shadowrootserializable="">
            <div style="border: 2px solid blue; padding: 10px; background-color: white;">
                <h2>Basic Element</h2>
                <div>
                    <slot>
                        <h3>Innner basic-element</h3>
                        <basic-element title="Pure HTML Custom Element nested" count="75" active="true" color="purple">
                            <template shadowrootmode="open" shadowrootserializable="">
                                <div style="border: 2px solid blue; padding: 10px; background-color: white;">
                                    <h2>Basic Element</h2>
                                    <div>
                                        <slot>
                                            <p>This is child content from pure nested HTML custom element</p>
                                        </slot>
                                    </div>
                                    <p>Count: 0</p>
                                    <p>Active: No</p>
                                </div>
                            </template></basic-element>
                        <p>Footer</p>
                    </slot>
                </div>
                <p>Count: 0</p>
                <p>Active: No</p>
            </div>
        </template></basic-element>
</div>
</>

/**
 * Serializes an element to HTML string, recursively handling shadow DOM.
 * For custom elements with shadowRoot: wraps shadow content in <template shadowrootmode="open">,
 * then appends only light DOM children that are NOT assigned to any slot (hidden from output).
 * Falls back to element.innerHTML for elements without shadow DOM.
 */
function getInnerHTML(element: Element): string {
    if (!element) return ''
    return _serializeChildren(element)
}

function _serializeElement(el: Element): string {
    const shadowRoot = (el as any).shadowRoot as ShadowRoot | null
    
    if (shadowRoot) {
        // Open tag
        const tag = el.tagName.toLowerCase()
        let attrs = ''
        for (let i = 0; i < el.attributes.length; i++) {
            const a = el.attributes[i]
            attrs += ` ${a.name}="${a.value}"`
        }
        
        // Shadow DOM: emit <template shadowrootmode="open"> with shadow content
        // <slot> elements inside will be replaced with assignedNodes() content
        let inner = `<template shadowrootmode="open" shadowrootserializable="">`
        inner += _serializeShadowRoot(shadowRoot)
        inner += `</template>`
        
        return `<${tag}${attrs}>${inner}</${tag}>`
    }
    
    // No shadow root: regular element — recurse into children
    const tag = el.tagName.toLowerCase()
    let attrs = ''
    for (let i = 0; i < el.attributes.length; i++) {
        const a = el.attributes[i]
        attrs += ` ${a.name}="${a.value}"`
    }
    return `<${tag}${attrs}>${_serializeChildren(el)}</${tag}>`
}

function _serializeShadowRoot(shadowRoot: ShadowRoot): string {
    let html = ''
    shadowRoot.childNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as Element
            if (el.tagName === 'SLOT') {
                // Keep <slot> tag, populate with assignedNodes() content inside it
                let slotContent = ''
                const assigned = (el as HTMLSlotElement).assignedNodes({ flatten: true })
                assigned.forEach((assignedNode) => {
                    if (assignedNode.nodeType === Node.ELEMENT_NODE) {
                        slotContent += _serializeElement(assignedNode as Element)
                    } else if (assignedNode.nodeType === Node.TEXT_NODE) {
                        slotContent += (assignedNode as Text).textContent || ''
                    }
                })
                html += `<slot>${slotContent}</slot>`
            } else {
                // Pass shadowRoot as slotContext so nested <slot> inside e.g. <div> can be resolved
                html += _serializeElementWithSlot(el, shadowRoot)
            }
        } else if (node.nodeType === Node.TEXT_NODE) {
            html += (node as Text).textContent || ''
        }
    })
    return html
}

function _serializeChildren(element: Element, slotContext?: ShadowRoot): string {
    let html = ''
    element.childNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as Element
            if (el.tagName === 'SLOT' && slotContext) {
                // Keep <slot> tag, populate with assignedNodes() content inside it
                let slotContent = ''
                const assigned = (el as HTMLSlotElement).assignedNodes({ flatten: true })
                assigned.forEach((assignedNode) => {
                    if (assignedNode.nodeType === Node.ELEMENT_NODE) {
                        slotContent += _serializeElement(assignedNode as Element)
                    } else if (assignedNode.nodeType === Node.TEXT_NODE) {
                        slotContent += (assignedNode as Text).textContent || ''
                    }
                })
                html += `<slot>${slotContent}</slot>`
            } else {
                html += _serializeElementWithSlot(el, slotContext)
            }
        } else if (node.nodeType === Node.TEXT_NODE) {
            html += (node as Text).textContent || ''
        }
    })
    return html
}

function _serializeElementWithSlot(el: Element, slotContext?: ShadowRoot): string {
    const shadowRoot = (el as any).shadowRoot as ShadowRoot | null
    if (shadowRoot) return _serializeElement(el)
    const tag = el.tagName.toLowerCase()
    let attrs = ''
    for (let i = 0; i < el.attributes.length; i++) {
        const a = el.attributes[i]
        attrs += ` ${a.name}="${a.value}"`
    }
    return `<${tag}${attrs}>${_serializeChildren(el, slotContext)}</${tag}>`
}


TestCustomElementSlotsWithSSR.test = {
    static: true,
    expect: () => {
       const expected = '<h1>Custom Element Slots Test</h1><h2>1. Basic Slot Functionality</h2><basic-element title="Pure HTML Custom Element" count="75" active="true" color="purple"><h3>Innner basic-element</h3><basic-element title="Pure HTML Custom Element" count="75" active="true" color="purple"><p>This is child content from pure nested HTML custom element</p></basic-element><p>Footer</p></basic-element>'

       console.log('[TestCustomElementSlotsWithSSR] incomplete innerHTML', getInnerHTML($$($$(testObservables['TestCustomElementSlots_ref']))))
    //    console.log('[TestCustomElementSlotsWithSSR] trace shadowRoot', getInnerHTML($$($$(testObservables['TestCustomElementSlots_ref'])).children[2].children[0]))

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
// export default () => null

// console.log(renderToString(<TestCustomElementSlotsWithSSR />))