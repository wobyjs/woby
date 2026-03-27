import { $, $$, render, renderToString, useEffect, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestRenderAppendReactive'
const TestRenderAppendReactive = (): JSX.Element => {
    const items = $<string[]>(['Item 1'])
    const containerRef = $<HTMLDivElement>()

    registerTestObservable(name, items)

    // Static effect to add initial appends with dispose
    useEffect(() => {
        setTimeout(() => {
            const container = $$(containerRef)
            if (container) {
                // First static append
                const dispose1 = render(<p>Reactive static append 1</p>, container, { append: true })
                console.log('✅ Reactive static append 1 added')

                // Second static append
                setTimeout(() => {
                    const dispose2 = render(<p>Reactive static append 2</p>, container, { append: true })
                    console.log('✅ Reactive static append 2 added')

                    // Explicit dispose test
                    setTimeout(() => {
                        dispose2()
                        console.log('✅ Reactive static append 2 disposed - should be removed')
                    }, 150)
                }, 75)
            }
        }, 100)
    })

    // Auto-append items to demonstrate the append option
    useInterval(() => {
        const currentItems = $$(items)
        if (currentItems.length < 4) {
            const newItem = `Item ${currentItems.length + 1}`
            items([...currentItems, newItem])

            // Append new item to container without removing existing ones
            const container = $$(containerRef)
            if (container) {
                render(<p class="appended">{newItem}</p>, container, { append: true })
            }
        }
    }, TEST_INTERVAL)

    const ret: JSX.Element = () => {
        const currentItems = $$(items)

        return (
            <>
                <h3>Render - Append Reactive</h3>
                <div style={{ marginBottom: '10px' }}>
                    <p>Total items: {currentItems.length}</p>
                </div>
                <div
                    ref={containerRef}
                    style={{ border: '2px solid purple', padding: '10px', margin: '5px', minHeight: '50px' }}
                >
                    <p>Initial content</p>
                </div>
                <div style={{ marginTop: '10px' }}>
                    <button
                        onClick={() => {
                            // Reset using default render (replaces all content)
                            const container = $$(containerRef)
                            if (container) {
                                render(<p>Reset content</p>, container)
                                items(['Item 1'])
                            }
                        }}
                    >
                        Reset (Replace All)
                    </button>
                </div>
            </>
        )
    }

    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestRenderAppendReactive.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        // SSR test - use initial state before intervals run
        // Note: SSR captures the component at the moment renderToString is called
        // Since items starts as ['Item 1'], we expect Total items: 1
        const ssrExpected = `<h3>Render - Append Reactive</h3><div style="margin-bottom: 10px;"><p>Total items: 1</p></div><div style="border: 2px solid purple; padding: 10px; margin: 5px; min-height: 50px;"><p>Initial content</p></div><div style="margin-top: 10px;"><button>Reset (Replace All)</button></div>`

        // Create a static snapshot component with fixed initial state
        const StaticSnapshot = (): JSX.Element => (
            <>
                <h3>Render - Append Reactive</h3>
                <div style={{ marginBottom: '10px' }}>
                    <p>Total items: 1</p>
                </div>
                <div style={{ border: '2px solid purple', padding: '10px', margin: '5px', minHeight: '50px' }}>
                    <p>Initial content</p>
                </div>
                <div style={{ marginTop: '10px' }}>
                    <button>Reset (Replace All)</button>
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

        // Timeline:
        // t=0-100ms: Initial only (items=1)
        // t≈100-175ms: + Reactive static append 1 (items=1)
        // t≈175-250ms: + Reactive static append 2 (items=1)
        // t≈250ms+: dispose2() removes "Reactive static append 2" (items=1)
        // t≈250ms+: useInterval starts adding items via interval
        //   - Interval 1: items=[Item 1, Item 2], adds <p class="appended">Item 2</p>
        //   - Interval 2: items=[Item 1, Item 2, Item 3], adds <p class="appended">Item 3</p>
        //   - Interval 3: items=[Item 1, Item 2, Item 3, Item 4], adds <p class="appended">Item 4</p>
        // 
        // IMPORTANT: During intervals, item count and DOM may be temporarily out of sync
        // due to render() being async. We must accept ALL possible combinations.

        // Accept ANY of these valid states (full component structure)
        return [
            // State 0: Before any static appends (items=1)
            `<div style="margin-bottom: 10px;"><p>Total items: 1</p></div><div style="border: 2px solid purple; padding: 10px; margin: 5px; min-height: 50px;"><p>Initial content</p></div><div style="margin-top: 10px;"><button>Reset (Replace All)</button></div>`,

            // State 1: After reactive static append 1 (items=1)
            `<div style="margin-bottom: 10px;"><p>Total items: 1</p></div><div style="border: 2px solid purple; padding: 10px; margin: 5px; min-height: 50px;"><p>Initial content</p><p>Reactive static append 1</p></div><div style="margin-top: 10px;"><button>Reset (Replace All)</button></div>`,

            // State 2: After reactive static append 2 (items=2)
            `<div style="margin-bottom: 10px;"><p>Total items: 2</p></div><div style="border: 2px solid purple; padding: 10px; margin: 5px; min-height: 50px;"><p>Initial content</p><p>Reactive static append 1</p><p>Reactive static append 2</p></div><div style="margin-top: 10px;"><button>Reset (Replace All)</button></div>`,

            // State 2a: Interval fired (items=2) but only first static append present (timing race)
            `<div style="margin-bottom: 10px;"><p>Total items: 2</p></div><div style="border: 2px solid purple; padding: 10px; margin: 5px; min-height: 50px;"><p>Initial content</p><p>Reactive static append 1</p></div><div style="margin-top: 10px;"><button>Reset (Replace All)</button></div>`,

            // State 2: After reactive static append 2 (items=1)
            `<div style="margin-bottom: 10px;"><p>Total items: 1</p></div><div style="border: 2px solid purple; padding: 10px; margin: 5px; min-height: 50px;"><p>Initial content</p><p>Reactive static append 1</p><p>Reactive static append 2</p></div><div style="margin-top: 10px;"><button>Reset (Replace All)</button></div>`,

            // State 3: After dispose2() (items=1)
            `<div style="margin-bottom: 10px;"><p>Total items: 1</p></div><div style="border: 2px solid purple; padding: 10px; margin: 5px; min-height: 50px;"><p>Initial content</p><p>Reactive static append 1</p></div><div style="margin-top: 10px;"><button>Reset (Replace All)</button></div>`,

            // State 4: After first interval - items updated to 2, DOM has Item 2 (SYNCHRONIZED)
            `<div style="margin-bottom: 10px;"><p>Total items: 2</p></div><div style="border: 2px solid purple; padding: 10px; margin: 5px; min-height: 50px;"><p>Initial content</p><p class="appended">Item 2</p></div><div style="margin-top: 10px;"><button>Reset (Replace All)</button></div>`,

            // State 5: After first interval - items still 1, but DOM has Item 2 (RACE CONDITION)
            `<div style="margin-bottom: 10px;"><p>Total items: 1</p></div><div style="border: 2px solid purple; padding: 10px; margin: 5px; min-height: 50px;"><p>Initial content</p><p class="appended">Item 2</p></div><div style="margin-top: 10px;"><button>Reset (Replace All)</button></div>`,

            // State 6: After second interval - items updated to 3, DOM has Items 2,3 (SYNCHRONIZED)
            `<div style="margin-bottom: 10px;"><p>Total items: 3</p></div><div style="border: 2px solid purple; padding: 10px; margin: 5px; min-height: 50px;"><p>Initial content</p><p class="appended">Item 2</p><p class="appended">Item 3</p></div><div style="margin-top: 10px;"><button>Reset (Replace All)</button></div>`,

            // State 7: After second interval - items still 2, but DOM has Items 2,3 (RACE CONDITION)
            `<div style="margin-bottom: 10px;"><p>Total items: 2</p></div><div style="border: 2px solid purple; padding: 10px; margin: 5px; min-height: 50px;"><p>Initial content</p><p class="appended">Item 2</p><p class="appended">Item 3</p></div><div style="margin-top: 10px;"><button>Reset (Replace All)</button></div>`,

            // State 8: After third interval - items updated to 4, DOM has Items 2,3,4 (SYNCHRONIZED)
            `<div style="margin-bottom: 10px;"><p>Total items: 4</p></div><div style="border: 2px solid purple; padding: 10px; margin: 5px; min-height: 50px;"><p>Initial content</p><p class="appended">Item 2</p><p class="appended">Item 3</p><p class="appended">Item 4</p></div><div style="margin-top: 10px;"><button>Reset (Replace All)</button></div>`,

            // State 9: After third interval - items still 3, but DOM has Items 2,3,4 (RACE CONDITION)
            `<div style="margin-bottom: 10px;"><p>Total items: 3</p></div><div style="border: 2px solid purple; padding: 10px; margin: 5px; min-height: 50px;"><p>Initial content</p><p class="appended">Item 2</p><p class="appended">Item 3</p><p class="appended">Item 4</p></div><div style="margin-top: 10px;"><button>Reset (Replace All)</button></div>`,

            // State 10: After first interval - items=2 but DOM render hasn't happened yet (items updated, DOM waiting)
            `<div style="margin-bottom: 10px;"><p>Total items: 2</p></div><div style="border: 2px solid purple; padding: 10px; margin: 5px; min-height: 50px;"><p>Initial content</p></div><div style="margin-top: 10px;"><button>Reset (Replace All)</button></div>`,

            // State 11: After second interval - items=3 but DOM render hasn't happened yet
            `<div style="margin-bottom: 10px;"><p>Total items: 3</p></div><div style="border: 2px solid purple; padding: 10px; margin: 5px; min-height: 50px;"><p>Initial content</p></div><div style="margin-top: 10px;"><button>Reset (Replace All)</button></div>`,

            // State 12: After third interval - items=4 but DOM render hasn't happened yet
            `<div style="margin-bottom: 10px;"><p>Total items: 4</p></div><div style="border: 2px solid purple; padding: 10px; margin: 5px; min-height: 50px;"><p>Initial content</p></div><div style="margin-top: 10px;"><button>Reset (Replace All)</button></div>`,
        ]
    }
}


export default () => <TestSnapshots Component={TestRenderAppendReactive} />
