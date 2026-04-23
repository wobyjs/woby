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
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert, getInnerHTML, minimiseHtml } from './util'


// Define a simple custom element with basic props
const BasicElement2 = defaults(() => ({
    title: $('Basic Element', HtmlString),
    count: $(0, HtmlNumber),
    active: $(false, HtmlBoolean),
    color: $('blue')
}), ({ title, count, active, color, children }) => {
    return (
        <div style={{
            border: () => '2px solid ' + $$(color),
            padding: '10px',
            backgroundColor: () => $$(active) ? '#e0e0e0' : 'white'
        }}>
            <h2>{title}</h2>
            <div>{children}</div>
            <p>Count: {count}</p>
            <p>Active: {() => $$(active) ? 'Yes' : 'No'}</p>
        </div>
    )
})

// Register the custom element
customElement('basic-element2', BasicElement2)

// Augment JSX.IntrinsicElements to include custom element
declare module 'woby' {
    namespace JSX {
        interface IntrinsicElements {
            'basic-element2': ElementAttributes<typeof BasicElement2>
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


const name = 'TestCustomElementSlotsWithSSR'
const TestCustomElementSlotsWithSSR = (): JSX.Element => {
    const ref = $<HTMLDivElement>()

    //only happen in browser dom, not SSR, not renderToString
    const ret: JSX.Element = () => (
        <div ref={ref}>
            <h1>Custom Element Slots Test</h1>

            <h2>1. Basic Slot Functionality</h2>
            <div dangerouslySetInnerHTML={{
                __html: `<basic-element2
                title="Pure HTML Custom Element"
                count="75"
                active="true"
                color="purple"
            >
                <h3>Innner basic-element2</h3>
                    <basic-element2
                    title="Pure HTML Custom Element nested"
                    count="66"
                    active="true"
                    color="purple"
                    >
                    <p>This is child content from pure nested HTML custom element</p>
                </basic-element2>
                <p>Footer</>
            </basic-element2>` }} />
        </div>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

const a = <>
    <h1>Custom Element Slots Test</h1>
    <h2>1. Basic Slot Functionality</h2>
    <div>
        <basic-element2 title="Pure HTML Custom Element" count="75" active="true" color="purple">
            <template shadowrootmode="open" shadowrootserializable="">
                <div style="border: 2px solid purple; padding: 10px; background-color: rgb(224, 224, 224);">
                    <h2>Basic Element</h2>
                    <div>
                        <slot>
                            <h3>Innner basic-element2</h3>
                            <basic-element2 title="Pure HTML Custom Element nested" count="66" active="true" color="purple">
                                <template shadowrootmode="open" shadowrootserializable="">
                                    <div style="border: 2px solid purple; padding: 10px; background-color: rgb(224, 224, 224);">
                                        <h2>Basic Element</h2>
                                        <div>
                                            <slot>
                                                <p>This is child content from pure nested HTML custom element</p>
                                            </slot>
                                        </div>
                                        <p>Count: 0</p>
                                        <p>Active: No</p>
                                    </div>
                                </template></basic-element2>
                            <p>Footer</p>
                        </slot>
                    </div>
                    <p>Count: 0</p>
                    <p>Active: No</p>
                </div>
            </template></basic-element2>
    </div>
</>


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestCustomElementSlotsWithSSR()
    const ssrComponent = testObservables[`${name}_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestCustomElementSlotsWithSSR\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestCustomElementSlotsWithSSR.test = {
    static: true,
    expect: () => {
        const expected = [`<div><h1>Custom Element Slots Test</h1><h2>1. Basic Slot Functionality</h2><div><basic-element2 title="Pure HTML Custom Element" count="75" active="true" color="purple"><template shadowrootmode="open" shadowrootserializable=""><div style="border: 2px solid blue; padding: 10px; background-color: white;"><h2>Basic Element</h2><div><slot><basic-element2 title="Pure HTML Custom Element nested" count="66" active="true" color="purple"><template shadowrootmode="open" shadowrootserializable=""><div style="border: 2px solid blue; padding: 10px; background-color: white;"><h2>Basic Element</h2><div><slot><p>This is child content from pure nested HTML custom element</p></slot></div><p>Count: 0</p><p>Active: No</p></div></template></basic-element2><p>Footer </p></slot></div><p>Count: 0</p><p>Active: No</p></div></template></basic-element2></div></div>`,
            minimiseHtml(`
            <div>
    <h1>Custom Element Slots Test</h1>
    <h2>1. Basic Slot Functionality</h2>
    <div><basic-element2 title="Pure HTML Custom Element" count="75" active="true" color="purple"><template
                shadowrootmode="open" shadowrootserializable="">
                <div style="border: 2px solid purple; padding: 10px; background-color: rgb(224, 224, 224);">
                    <h2>Pure HTML Custom Element</h2>
                    <div>
                        <slot>
                            <basic-element2 title="Pure HTML Custom Element nested" count="66" active="true"
                               color="purple"><template shadowrootmode="open" shadowrootserializable="">
                                    <div style="border: 2px solid purple; padding: 10px; background-color: rgb(224, 224, 224);">
                                        <h2>Pure HTML Custom Element nested</h2>
                                        <div>
                                            <slot>
                                                <p>This is child content from pure nested HTML custom element</p>
                                            </slot>
                                        </div>
                                        <p>Count: 66</p>
                                        <p>Active: Yes</p>
                                    </div>
                                </template></basic-element2>
                            <p>Footer
                            </p>
                        </slot>
                    </div>
                    <p>Count: 75</p>
                    <p>Active: Yes</p>
                </div>
            </template>
        </basic-element2>
    </div>
</div>`),
]

        // console.log('[TestCustomElementSlotsWithSSR] incomplete innerHTML', getInnerHTML($$($$(testObservables[`${name}_ref`]))))
        //    console.log('[TestCustomElementSlotsWithSSR] trace shadowRoot', getInnerHTML($$($$(testObservables[`${name}_ref`])).children[2].children[0]))

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = minimiseHtml(renderToString(ssrComponent))

        // Expected SSR output - matches actual renderToString output (without shadow DOM templates in SSR)
        const expectedFull = minimiseHtml('<div><h1>Custom Element Slots Test</h1><h2>1. Basic Slot Functionality</h2><div><basic-element2 title="Pure HTML Custom Element" count="75" active="true" color="purple" ><h3>Innner basic-element2</h3><basic-element2 title="Pure HTML Custom Element nested" count="66" active="true" color="purple" ><p>This is child content from pure nested HTML custom element</p></basic-element2><p>Footer</></basic-element2></div></div>')

        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}

export default () => <TestSnapshots Component={TestCustomElementSlotsWithSSR} />
// export default () => null

// console.log(renderToString(<TestCustomElementSlotsWithSSR />))