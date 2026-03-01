import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestIdStatic = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>ID - Static</h3>
            <p id="foo">content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestIdStatic_ssr', ret)

    return ret
}

TestIdStatic.test = {
    static: true,
    expect: () => {
        const expected = '<p id="foo">content</p>'

        const ssrComponent = testObservables['TestIdStatic_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>ID - Static</h3><p id="foo">content</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestIdStatic] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestIdStatic] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestIdStatic} />