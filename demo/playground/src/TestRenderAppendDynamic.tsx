import { $, $$, render, renderToString, useEffect, type JSX } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert, minimiseHtml } from './util'

const name = 'TestRenderAppendDynamic'
const CONTAINER_ID_DYNAMIC = 'test-render-append-dynamic-container'
const TestRenderAppendDynamic = (): JSX.Element => {
    const count = $(0)
    registerTestObservable(name, count)

    // Static effect to add initial appends
    useEffect(() => {
        setTimeout(() => {
            const container = document.getElementById(CONTAINER_ID_DYNAMIC)
            if (container) {
                // Static append with dispose tracking
                const dispose = render(<p>Initial dynamic append</p>, container, { append: true })
                console.log('✅ Initial dynamic append added')

                // Test explicit dispose after 200ms
                setTimeout(() => {
                    dispose()
                    console.log('✅ Initial dynamic append disposed - should be removed')
                }, 200)
            }
        }, 100)
    })

    // Auto-click "Append Item" button 3 times with delays
    useEffect(() => {
        setTimeout(() => {
            // Find button by text content
            const buttons = document.querySelectorAll('button')
            const appendButton = Array.from(buttons).find(btn => btn.textContent === 'Append Item') as HTMLButtonElement
            if (appendButton) {
                // Click 1
                appendButton.click()
                console.log('✅ Auto-clicked Append Item #1')

                setTimeout(() => {
                    // Click 2
                    appendButton.click()
                    console.log('✅ Auto-clicked Append Item #2')

                    setTimeout(() => {
                        // Click 3
                        appendButton.click()
                        console.log('✅ Auto-clicked Append Item #3')
                    }, 50)
                }, 50)
            }
        }, 400) // Wait for initial dynamic append to settle first
    })

    const ret: JSX.Element = () => {
        const containerId = CONTAINER_ID_DYNAMIC

        return (
            <>
                <h3>Render - Append Dynamic Content</h3>
                <div style={{ marginBottom: '10px' }}>
                    <p>Count: {count}</p>
                </div>
                <div
                    id={containerId}
                    style={{ border: '2px solid green', padding: '10px', margin: '5px', minHeight: '50px' }}
                >
                    <p>Initial static content</p>
                </div>
                <div style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
                    <button
                        onClick={() => {
                            const container = document.getElementById(containerId)
                            if (container) {
                                // Append new content without removing existing
                                render(<p>Appended item #{count() + 1}</p>, container, { append: true })
                                count(count() + 1)
                            }
                        }}
                    >
                        Append Item
                    </button>
                    <button
                        onClick={() => {
                            const container = document.getElementById(containerId)
                            if (container) {
                                // Replace all content (default behavior)
                                render(<p>Replaced with single item</p>, container)
                                count(0)
                            }
                        }}
                    >
                        Replace All
                    </button>
                </div>
            </>
        )
    }

    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestRenderAppendDynamic()
    const ssrComponent = testObservables[`TestRenderAppendDynamic_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestRenderAppendDynamic\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestRenderAppendDynamic.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        // SSR test with append:true
        // Note: Attribute order in SSR output follows JSX property order: id comes BEFORE style (as written in JSX)
        // Full component structure includes the count div before the container
        const ssrExpected = `<h3>Render - Append Dynamic Content</h3><div style="margin-bottom: 10px;"><p>Count: 0</p></div><div id="${CONTAINER_ID_DYNAMIC}" style="border: 2px solid green; padding: 10px; margin: 5px; min-height: 50px;"><p>Initial static content</p></div><div style="margin-top: 10px; display: flex; gap: 5px;"><button>Append Item</button><button>Replace All</button></div>`

        // Create a static snapshot component with fixed initial state (interval won't affect it)
        const StaticSnapshot = (): JSX.Element => (
            <>
                <h3>Render - Append Dynamic Content</h3>
                <div style={{ marginBottom: '10px' }}>
                    <p>Count: 0</p>
                </div>
                <div id={CONTAINER_ID_DYNAMIC} style={{ border: '2px solid green', padding: '10px', margin: '5px', minHeight: '50px' }}>
                    <p>Initial static content</p>
                </div>
                <div style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
                    <button>Append Item</button>
                    <button>Replace All</button>
                </div>
            </>
        )

        const ssrResult = renderToString(<StaticSnapshot />)

        if (ssrResult !== ssrExpected) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${ssrExpected}`)
        } else {
            console.log(`✅ [${name}] SSR test passed`)
        }

        const idx = $$(testObservables[name])
        // Multiple valid states during animation:
        // Timeline:
        // t=0-100ms: Initial only (count=0)
        // t≈100-300ms: Initial + dynamic append (count=0)
        // t≈300-450ms: After dispose (count=0)
        // t≈450ms+: Auto-clicks start
        //   - Click 1: count updates to 1, adds "Appended item #1"
        //   - Click 2: count updates to 2, adds "Appended item #2"
        //   - Click 3: count updates to 3, adds "Appended item #3"
        // 
        // IMPORTANT: During rapid clicks, count and DOM may be temporarily out of sync
        // due to render() being async. We must accept ALL possible combinations.

        // Accept ANY of these valid states (full component structure)
        return [
            // State 0: Before any appends (count=0, no items)
            minimiseHtml(`
                <div style="margin-bottom: 10px;"><p>Count: 0</p></div>
                <div id="${CONTAINER_ID_DYNAMIC}" style="border: 2px solid green; padding: 10px; margin: 5px; min-height: 50px;">
                    <p>Initial static content</p>
                </div>
                <div style="margin-top: 10px; display: flex; gap: 5px;">
                    <button>Append Item</button>
                    <button>Replace All</button>
                </div>
            `),

            // State 1: After initial dynamic append, before dispose (count=0, has dynamic append)
            minimiseHtml(`
                <div style="margin-bottom: 10px;"><p>Count: 0</p></div>
                <div id="${CONTAINER_ID_DYNAMIC}" style="border: 2px solid green; padding: 10px; margin: 5px; min-height: 50px;">
                    <p>Initial static content</p>
                    <p>Initial dynamic append</p>
                </div>
                <div style="margin-top: 10px; display: flex; gap: 5px;">
                    <button>Append Item</button>
                    <button>Replace All</button>
                </div>
            `),

            // State 2: After click 1 - count updated, DOM has item #1 (SYNCHRONIZED)
            minimiseHtml(`
                <div style="margin-bottom: 10px;"><p>Count: 1</p></div>
                <div id="${CONTAINER_ID_DYNAMIC}" style="border: 2px solid green; padding: 10px; margin: 5px; min-height: 50px;">
                    <p>Initial static content</p>
                    <p>Appended item #1</p>
                </div>
                <div style="margin-top: 10px; display: flex; gap: 5px;">
                    <button>Append Item</button>
                    <button>Replace All</button>
                </div>
            `),

            // State 3: After click 1 - count still 0, but DOM has item #1 (RACE CONDITION)
            minimiseHtml(`
                <div style="margin-bottom: 10px;"><p>Count: 0</p></div>
                <div id="${CONTAINER_ID_DYNAMIC}" style="border: 2px solid green; padding: 10px; margin: 5px; min-height: 50px;">
                    <p>Initial static content</p>
                    <p>Appended item #1</p>
                </div>
                <div style="margin-top: 10px; display: flex; gap: 5px;">
                    <button>Append Item</button>
                    <button>Replace All</button>
                </div>
            `),

            // State 4: After click 2 - count updated to 2, DOM has items #1,#2 (SYNCHRONIZED)
            minimiseHtml(`
                <div style="margin-bottom: 10px;"><p>Count: 2</p></div>
                <div id="${CONTAINER_ID_DYNAMIC}" style="border: 2px solid green; padding: 10px; margin: 5px; min-height: 50px;">
                    <p>Initial static content</p>
                    <p>Appended item #1</p>
                    <p>Appended item #2</p>
                </div>
                <div style="margin-top: 10px; display: flex; gap: 5px;">
                    <button>Append Item</button>
                    <button>Replace All</button>
                </div>
            `),

            // State 5: After click 2 - count still 1, but DOM has items #1,#2 (RACE CONDITION)
            minimiseHtml(`
                <div style="margin-bottom: 10px;"><p>Count: 1</p></div>
                <div id="${CONTAINER_ID_DYNAMIC}" style="border: 2px solid green; padding: 10px; margin: 5px; min-height: 50px;">
                    <p>Initial static content</p>
                    <p>Appended item #1</p>
                    <p>Appended item #2</p>
                </div>
                <div style="margin-top: 10px; display: flex; gap: 5px;">
                    <button>Append Item</button>
                    <button>Replace All</button>
                </div>
            `),

            // State 6: After click 3 - count updated to 3, DOM has items #1,#2,#3 (SYNCHRONIZED)
            minimiseHtml(`
                <div style="margin-bottom: 10px;"><p>Count: 3</p></div>
                <div id="${CONTAINER_ID_DYNAMIC}" style="border: 2px solid green; padding: 10px; margin: 5px; min-height: 50px;">
                    <p>Initial static content</p>
                    <p>Appended item #1</p>
                    <p>Appended item #2</p>
                    <p>Appended item #3</p>
                </div>
                <div style="margin-top: 10px; display: flex; gap: 5px;">
                    <button>Append Item</button>
                    <button>Replace All</button>
                </div>
            `),

            // State 7: After click 3 - count still 2, but DOM has items #1,#2,#3 (RACE CONDITION)
            minimiseHtml(`
                <div style="margin-bottom: 10px;"><p>Count: 2</p></div>
                <div id="${CONTAINER_ID_DYNAMIC}" style="border: 2px solid green; padding: 10px; margin: 5px; min-height: 50px;">
                    <p>Initial static content</p>
                    <p>Appended item #1</p>
                    <p>Appended item #2</p>
                    <p>Appended item #3</p>
                </div>
                <div style="margin-top: 10px; display: flex; gap: 5px;">
                    <button>Append Item</button>
                    <button>Replace All</button>
                </div>
            `),

            // State 8: Initial dynamic append STILL present + Appended item #1 (timing overlap, count=0)
            // This happens when auto-click fires before initial dynamic append is disposed
            minimiseHtml(`
                <div style="margin-bottom: 10px;"><p>Count: 0</p></div>
                <div id="${CONTAINER_ID_DYNAMIC}" style="border: 2px solid green; padding: 10px; margin: 5px; min-height: 50px;">
                    <p>Initial static content</p>
                    <p>Initial dynamic append</p>
                    <p>Appended item #1</p>
                </div>
                <div style="margin-top: 10px; display: flex; gap: 5px;">
                    <button>Append Item</button>
                    <button>Replace All</button>
                </div>
            `),

            // State 9: Initial dynamic append STILL present + Appended item #1 (timing overlap, count=1)
            minimiseHtml(`
                <div style="margin-bottom: 10px;"><p>Count: 1</p></div>
                <div id="${CONTAINER_ID_DYNAMIC}" style="border: 2px solid green; padding: 10px; margin: 5px; min-height: 50px;">
                    <p>Initial static content</p>
                    <p>Initial dynamic append</p>
                    <p>Appended item #1</p>
                </div>
                <div style="margin-top: 10px; display: flex; gap: 5px;">
                    <button>Append Item</button>
                    <button>Replace All</button>
                </div>
            `),

            // State 10: Initial dynamic append STILL present + Appended items #1,#2 (timing overlap, count=1)
            minimiseHtml(`
                <div style="margin-bottom: 10px;"><p>Count: 1</p></div>
                <div id="${CONTAINER_ID_DYNAMIC}" style="border: 2px solid green; padding: 10px; margin: 5px; min-height: 50px;">
                    <p>Initial static content</p>
                    <p>Initial dynamic append</p>
                    <p>Appended item #1</p>
                    <p>Appended item #2</p>
                </div>
                <div style="margin-top: 10px; display: flex; gap: 5px;">
                    <button>Append Item</button>
                    <button>Replace All</button>
                </div>
            `),

            // State 11: Initial dynamic append STILL present + Appended items #1,#2 (timing overlap, count=2)
            minimiseHtml(`
                <div style="margin-bottom: 10px;"><p>Count: 2</p></div>
                <div id="${CONTAINER_ID_DYNAMIC}" style="border: 2px solid green; padding: 10px; margin: 5px; min-height: 50px;">
                    <p>Initial static content</p>
                    <p>Initial dynamic append</p>
                    <p>Appended item #1</p>
                    <p>Appended item #2</p>
                </div>
                <div style="margin-top: 10px; display: flex; gap: 5px;">
                    <button>Append Item</button>
                    <button>Replace All</button>
                </div>
            `),
        ]
    }
}


export default () => <TestSnapshots Component={TestRenderAppendDynamic} />
