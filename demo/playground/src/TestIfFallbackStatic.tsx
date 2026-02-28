import { $, $$, If, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestIfFallbackStatic = (): JSX.Element => {
    const ret: JSX.Element = (
        <>
            <h3>If - Fallback Static</h3>
            <If when={false} fallback={<p>Fallback!</p>}>Children</If>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestIfFallbackStatic_ssr', ret)

    return ret
}

TestIfFallbackStatic.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>If - Fallback Static</h3><p>Fallback!</p>'
        const expected = '<p>Fallback!</p>'

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestIfFallbackStatic_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestIfFallbackStatic] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestIfFallbackStatic] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestIfFallbackStatic] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestIfFallbackStatic} />