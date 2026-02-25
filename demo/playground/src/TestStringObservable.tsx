import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const TestStringObservable = (): JSX.Element => {
    const o = $(String(random()))
    // Store the observable globally so the test can access it
    registerTestObservable('TestStringObservable', o)
    const randomize = () => o(String(random()))
    useInterval(randomize, TEST_INTERVAL)
    const ret: JSX.Element = (
        <>
            <h3>String - Observable</h3>
            <p>{o}</p>
        </>
    )

    // Store the component for SSR testing - only in environments where function is available
    if (typeof registerTestObservable !== 'undefined') {
        registerTestObservable('TestStringObservable_ssr', ret)
    }

    return ret
}

TestStringObservable.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestStringObservable'])
        const expected = `<p>${value}</p>`

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestStringObservable_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = `<h3>String - Observable</h3><p>${value}</p>`
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestStringObservable] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestStringObservable] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestStringObservable] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestStringObservable} />