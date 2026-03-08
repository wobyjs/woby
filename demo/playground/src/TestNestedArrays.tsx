import { $, $$, For, If, renderToString, type JSX } from 'woby'
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

    const ret: JSX.Element = () => (
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
        const itemsObservable = testObservables['TestNestedArrays']
        const activeItemObservable = testObservables['TestNestedArrays-activeItem']
        const itemsState = (typeof itemsObservable === 'function' ? itemsObservable() : [0, 1, 2])
        const activeItemState = (typeof activeItemObservable === 'function' ? activeItemObservable() : 1)

        // DOM expectation - includes <!----> comment placeholders from If blocks
        let htmlDom = '<button>Increment</button><ul>'
        for (let i = 0; i < itemsState.length; i++) {
            const item = itemsState[i]
            if (activeItemState === item) {
                htmlDom += '<li>test</li>'
            } else {
                htmlDom += '<!---->'
            }
            htmlDom += `<li>${item}</li>`
        }
        htmlDom += '</ul>'
        const expected = htmlDom   // For main DOM test comparison

        // SSR expectation - NO <!----> comment placeholders
        let htmlSsr = '<button>Increment</button><ul>'
        for (let i = 0; i < itemsState.length; i++) {
            const item = itemsState[i]
            if (activeItemState === item) {
                htmlSsr += '<li>test</li>'
            }
            htmlSsr += `<li>${item}</li>`
        }
        htmlSsr += '</ul>'
        const expectedFull = '<h3>Nested Arrays</h3>' + htmlSsr

        // Test the SSR value synchronously
        const ssrComponent = testObservables['TestNestedArrays_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestNestedArrays] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestNestedArrays] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestNestedArrays} /> // HMR