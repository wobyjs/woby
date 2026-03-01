import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestComponentStaticRenderState = ({ value = 0 }: { value?: number }): JSX.Element => {
    const multiplier = 0
    const ret: JSX.Element = () => (
        <>
            <h3>Component - Static Render State</h3>
            <p>{(value || 0) * multiplier}</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestComponentStaticRenderState_ssr', ret)

    return ret
}

TestComponentStaticRenderState.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>Component - Static Render State</h3><p>0</p>'  // For SSR comparison
        const expected = '<p>0</p>'   // For main test comparison

            const ssrComponent = testObservables['TestComponentStaticRenderState_ssr']
            const ssrResult = renderToString(ssrComponent)
            if (ssrResult !== expectedFull) {
                assert(false, `[TestComponentStaticRenderState] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
            } else {
                console.log(`✅ [TestComponentStaticRenderState] SSR test passed: ${ssrResult}`)
            }

        return expected
    }
}




export default () => <TestSnapshots Component={TestComponentStaticRenderState} />