import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestUndefinedStatic = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>Undefined - Static</h3>
            <p>{undefined}</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestUndefinedStatic_ssr', ret)

    return ret
}

TestUndefinedStatic.test = {
    static: true,
    expect: () => {
        const expected = '<p></p>'

        const ssrComponent = testObservables['TestUndefinedStatic_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Undefined - Static</h3><p></p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestUndefinedStatic] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestUndefinedStatic] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestUndefinedStatic} />