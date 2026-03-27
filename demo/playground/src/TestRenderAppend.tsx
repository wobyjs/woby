import { $, $$, render, renderToString, useEffect, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert, minimiseHtml } from './util'




const name = 'TestRenderAppend'
const CONTAINER_ID = 'test-render-append-container'
const TestRenderAppend = (): JSX.Element => {
    const containerId = CONTAINER_ID

    setTimeout(() => {
        const container = document.getElementById(containerId)
        if (container) {
            // First static append
            const dispose1 = render(<p>Static append 1</p>, container, { append: true })
            console.log('✅ Static append 1 added')

            // Second static append after a delay
            setTimeout(() => {
                const dispose2 = render(<p>Static append 2</p>, container, { append: true })
                console.log('✅ Static append 2 added')

                // Test explicit dispose - remove the second append after 100ms
                setTimeout(() => {
                    dispose2()
                    console.log('✅ dispose2() called - "Static append 2" should be removed')
                }, 100)
            }, 50)
        }
    }, 0)

    const ret: JSX.Element = () => {
        return (
            <>
                <h3>Render - Append Option</h3>
                <div id={containerId} style={{ border: '1px solid blue', padding: '10px', margin: '5px' }}>
                    <p>Initial content</p>
                </div>
                <div style={{ marginTop: '10px' }}>
                    {/* Static render calls that execute on mount */}
                    <button
                        onClick={() => {
                            const container = document.getElementById(containerId)
                            if (container) {
                                // Test render with append: true (keeps existing content)
                                render(<p>Appended content 1</p>, container, { append: true })
                            }
                        }}
                    >
                        Render Append (keep existing)
                    </button>
                    <button
                        onClick={() => {
                            const container = document.getElementById(containerId)
                            if (container) {
                                // Test render with append: false (default - clears content first)
                                render(<p>Replaced content</p>, container)
                            }
                        }}
                    >
                        Render Replace (clears existing)
                    </button>
                </div>
            </>
        )
    }

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestRenderAppend.test = {
    static: false, // Not static because of dynamic appends
    compareActualValues: true,
    expect: () => {
        // SSR: renderToString uses the same fixed CONTAINER_ID captured in closure
        // Attribute order in SSR output: id comes FIRST (as written in JSX: id={containerId} style=...)
        const ssrExpected = `<h3>Render - Append Option</h3><div id="${CONTAINER_ID}" style="border: 1px solid blue; padding: 10px; margin: 5px;"><p>Initial content</p></div><div style="margin-top: 10px;"><button>Render Append (keep existing)</button><button>Render Replace (clears existing)</button></div>`

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)

        if (ssrResult !== ssrExpected) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${ssrExpected}`)
        } else {
            console.log(`✅ [${name}] SSR test passed`)
        }

        // DOM expectation: final stable state after all timeouts complete
        // t=0ms: Initial only
        // t≈10ms: + Static append 1
        // t≈60ms: + Static append 2
        // t≈160ms: dispose2() removes Static append 2  ← final state: Initial + append 1 only
        const domExpected = [minimiseHtml(`
            <div id="${CONTAINER_ID}" style="border: 1px solid blue; padding: 10px; margin: 5px;">
                <p>Initial content</p>
                <p>Static append 1</p>
            </div>
            <div style="margin-top: 10px;">
                <button>Render Append (keep existing)</button>
                <button>Render Replace (clears existing)</button>
            </div>
        `),
        minimiseHtml(`
            <div id="${CONTAINER_ID}" style="border: 1px solid blue; padding: 10px; margin: 5px;">
                <p>Initial content</p>
                <p>Static append 1</p>
                <p>Static append 2</p>
            </div>
            <div style="margin-top: 10px;">
                <button>Render Append (keep existing)</button>
                <button>Render Replace (clears existing)</button>
            </div>
        `),
        minimiseHtml(`
            <div id="${CONTAINER_ID}" style="border: 1px solid blue; padding: 10px; margin: 5px;">
                <p>Initial content</p>
            </div>
            <div style="margin-top: 10px;">
                <button>Render Append (keep existing)</button>
                <button>Render Replace (clears existing)</button>
            </div>
        `)
        ]
        return domExpected
    }
}


export default () => <TestSnapshots Component={TestRenderAppend} />
