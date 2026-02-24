import { $, $$, For, If, renderToString } from 'woby'
import { TestSnapshots, useTimeout, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestNestedArrays = (): JSX.Element => {
    const items = $([0, 1, 2])
    const activeItem = $(1)
    // Store the observables globally so the test can access them
    registerTestObservable('TestNestedArrays', items) // Using items to track state changes
    registerTestObservable('TestNestedArrays-activeItem', activeItem)

    const incrementItems = () => {
        const newLength = items().length + 1
        items(prev => [...prev, prev.length])
        activeItem(newLength - 1) // Update to the new active item
    }

    useTimeout(incrementItems, TEST_INTERVAL)
    useTimeout(incrementItems, TEST_INTERVAL * 2)

    const ret: JSX.Element = (
        <>
            <h3>Nested Arrays</h3>
            <button onClick={incrementItems}>Increment</button>
            <ul>
                <For values={items}>
                    {item => {
                        return (
                            <>
                                <If when={() => activeItem() === item}>
                                    <li>test</li>
                                </If>
                                <li>
                                    {item}
                                </li>
                            </>
                        )
                    }}
                </For>
            </ul>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestNestedArrays_ssr', ret)

    return ret
}

TestNestedArrays.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        // Dynamically generate the expected HTML based on the current state
        const itemsObservable = testObservables['TestNestedArrays']
        const activeItemObservable = testObservables['TestNestedArrays-activeItem']
        const itemsState = (typeof itemsObservable === 'function' ? itemsObservable() : [0, 1, 2])
        const activeItemState = (typeof activeItemObservable === 'function' ? activeItemObservable() : 1)

        // Generate the list items dynamically
        let html = '<button>Increment</button><ul>'

        for (let i = 0; i < itemsState.length; i++) {
            const item = itemsState[i]
            // Add <!-- --> for inactive If blocks
            if (activeItemState !== item) {
                html += '<!---->'
            } else {
                html += '<li>test</li>'
            }
            html += `<li>${item}</li>`
        }

        html += '</ul>'

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestNestedArrays_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                // If it's a JSX element or function, we can render it to string
                // If it's a function, we need to call it first to get the element
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<h3>Nested Arrays</h3>' + html
                    if (ssrResult !== expectedFull) {
                        assert(false, `SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`SSR render error: ${err}`)
                })
            }
        }, 0)

        return html
    }
}


export default () => <TestSnapshots Component={TestNestedArrays} />