import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestBooleanRemoval = (): JSX.Element => {
    const o = $<boolean | string>(true)
    // Store the observable globally so the test can access it
    registerTestObservable('TestBooleanRemoval', o)
    const toggle = () => o(prev => prev === true ? 'removed' : true)
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = (
        <>
            <h3>Boolean - Removal</h3>
            <p>({o})</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestBooleanRemoval_ssr', ret)

    return ret
}

TestBooleanRemoval.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestBooleanRemoval'])
        let expected: string
        if (value === 'removed') {
            expected = '<p>(removed)</p>'
        } else if (typeof value === 'boolean') {
            expected = '<p>(<!---->)</p>'
        } else {
            expected = `<p>(${String(value)})</p>`
        }

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestBooleanRemoval_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = `<h3>Boolean - Removal</h3>${expected}`
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestBooleanRemoval] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestBooleanRemoval] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestBooleanRemoval] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestBooleanRemoval} />