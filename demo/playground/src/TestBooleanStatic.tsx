import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestBooleanStatic = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>Boolean - Static</h3>
            <p>truefalse</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestBooleanStatic_ssr', ret)

    return ret
}

TestBooleanStatic.test = {
    static: true,
    expect: () => {
        const expected = '<p>truefalse</p>'

        const ssrComponent = testObservables['TestBooleanStatic_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>Boolean - Static</h3>${expected}`
        if (ssrResult !== expectedFull) {
            assert(false, `[TestBooleanStatic] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestBooleanStatic] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestBooleanStatic} />