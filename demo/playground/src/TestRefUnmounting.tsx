import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestRefUnmounting = (): JSX.Element => {
    const message = $('No ref') // Static value
    const ret: JSX.Element = () => (
        <>
            <h3>Ref - Unmounting</h3>
            <p>{message}</p>
            <p>content</p> {/* Static content, not conditional */}
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestRefUnmounting_ssr', ret)

    return ret
}

TestRefUnmounting.test = {
    static: true,
    wrap: false,
    expect: () => {
        const expected = '<p>No ref</p><p>content</p> '

        const ssrComponent = testObservables['TestRefUnmounting_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Ref - Unmounting</h3><p>No ref</p><p>content</p> '
        if (ssrResult !== expectedFull) {
            assert(false, `[TestRefUnmounting] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestRefUnmounting] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestRefUnmounting} />