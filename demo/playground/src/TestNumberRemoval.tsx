import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const TestNumberRemoval = (): JSX.Element => {
    const o = $<number | null>(random())
    registerTestObservable('TestNumberRemoval', o)
    const randomize = () => o(prev => prev ? null : random())
    useInterval(randomize, TEST_INTERVAL)
    const ret: JSX.Element = (
        <>
            <h3>Number - Removal</h3>
            <p>({o})</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestNumberRemoval_ssr', ret)

    return ret
}

TestNumberRemoval.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const val = $$(testObservables['TestNumberRemoval'])
        const expected = val !== null ? `<p>(${val})</p>` : '<p>(<!---->)</p>'

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestNumberRemoval_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                // If it's a JSX element or function, we can render it to string
                // If it's a function, we need to call it first to get the element
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<h3>Number - Removal</h3>' + expected
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestNumberRemoval] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestNumberRemoval] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestNumberRemoval] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestNumberRemoval} />