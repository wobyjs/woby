import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestBooleanFunction = (): JSX.Element => {
    const o = $(true)
    const toggle = () => o(prev => !prev)
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = (
        <>
            <h3>Boolean - Function</h3>
            <p>{() => o()}</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestBooleanFunction_ssr', ret)

    return ret
}

TestBooleanFunction.test = {
    static: true,
    expect: () => {
        const expected = '<p><!----></p>'

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestBooleanFunction_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = `<h3>Boolean - Function</h3>${expected}`
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestBooleanFunction] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestBooleanFunction] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestBooleanFunction] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestBooleanFunction} />