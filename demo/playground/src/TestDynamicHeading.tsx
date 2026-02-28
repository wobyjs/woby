import { $, $$, Dynamic, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestDynamicHeading = (): JSX.Element => {
    const level = $(1 as 1 | 2 | 3 | 4 | 5 | 6)
    registerTestObservable('TestDynamicHeading', level)
    const increment = () => {
        const nextLevel = (level() + 1) % 7 || 1
        level(nextLevel as 1 | 2 | 3 | 4 | 5 | 6)
    }
    useInterval(increment, TEST_INTERVAL)
    const ret: JSX.Element = (
        <>
            <h3>Dynamic - Heading</h3>
            {() => {
                const headings = { 1: 'h1', 2: 'h2', 3: 'h3', 4: 'h4', 5: 'h5', 6: 'h6' }
                const tag = headings[level()]
                return <Dynamic component={tag}>
                    Level: {level}
                </Dynamic>
            }}
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestDynamicHeading_ssr', ret)

    return ret
}

TestDynamicHeading.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const level = $$(testObservables['TestDynamicHeading'])

        // Define expected values for both main test and SSR test
        const expectedFull = `<h3>Dynamic - Heading</h3><h${level}>Level: ${level}</h${level}>`  // For SSR comparison
        const expected = `<h${level}>Level: ${level}</h${level}>`   // For main test comparison

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestDynamicHeading_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                // If it's a JSX element or function, we can render it to string
                // If it's a function, we need to call it first to get the element
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestDynamicHeading] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestDynamicHeading] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestDynamicHeading] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestDynamicHeading} />