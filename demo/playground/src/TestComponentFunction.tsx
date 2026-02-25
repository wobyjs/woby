import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const TestComponentFunction = (): JSX.Element => {
    const getRandom = (): number => random()
    const o = $(getRandom())
    // Store the observable globally so the test can access it
    registerTestObservable('TestComponentFunction', o)
    const randomize = () => o(getRandom())
    useInterval(randomize, TEST_INTERVAL)
    const ret: JSX.Element = (
        <>
            <h3>Component - Function</h3>
            <p>{() => o()}</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestComponentFunction_ssr', ret)

    return ret
}

TestComponentFunction.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestComponentFunction'])

        // Define expected values for both main test and SSR test
        const expectedFull = `<h3>Component - Function</h3><p>${value}</p>`  // For SSR comparison
        const expected = `<p>${value}</p>`   // For main test comparison

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestComponentFunction_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                // If it's a JSX element or function, we can render it to string
                // If it's a function, we need to call it first to get the element
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestComponentFunction] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestComponentFunction] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestComponentFunction] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestComponentFunction} />