import { $, $$, If, renderToString, type JSX } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert } from './util'

const TestIfFunction = (): JSX.Element => {
    // Static value for static test
    const ret: JSX.Element = () => (
        <>
            <h3>If - Function</h3>
            <p>(<If when={true}>content</If>)</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestIfFunction_ssr', ret)

    return ret
}

TestIfFunction.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>If - Function</h3><p>(content)</p>'
        const expected = '<p>(content)</p>'

        const ssrComponent = testObservables['TestIfFunction_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestIfFunction] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestIfFunction] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestIfFunction} />