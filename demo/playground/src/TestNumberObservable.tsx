import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const TestNumberObservable = (): JSX.Element => {
    const o = $(random())
    registerTestObservable('TestNumberObservable', o)
    const randomize = () => o(random())
    useInterval(randomize, TEST_INTERVAL)
    const ret: JSX.Element = (
        <>
            <h3>Number - Observable</h3>
            <p>{o}</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestNumberObservable_ssr', ret)

    return ret
}

TestNumberObservable.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestNumberObservable'])
        const expected = `<p>${value}</p>`

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestNumberObservable_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                // If it's a JSX element or function, we can render it to string
                // If it's a function, we need to call it first to get the element
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<h3>Number - Observable</h3>' + expected
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestNumberObservable] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestNumberObservable] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestNumberObservable] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestNumberObservable} />