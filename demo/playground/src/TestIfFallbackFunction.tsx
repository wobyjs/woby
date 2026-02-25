import { $, $$, If, renderToString } from 'woby'
import { TestSnapshots, random, registerTestObservable, testObservables, assert } from './util'

const TestIfFallbackFunction = (): JSX.Element => {
    const initialValue = "0.123456"  // Fixed value for static test
    const Fallback = () => {
        return <p>Fallback: {initialValue}</p>
    }
    const ret: JSX.Element = (
        <>
            <h3>If - Fallback Function</h3>
            <If when={false} fallback={Fallback}>Children</If>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestIfFallbackFunction_ssr', ret)

    return ret
}

TestIfFallbackFunction.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>If - Fallback Function</h3><p>Fallback: 0.123456</p>'
        const expected = '<p>Fallback: 0.123456</p>'

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestIfFallbackFunction_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestIfFallbackFunction] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestIfFallbackFunction] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestIfFallbackFunction] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestIfFallbackFunction} />