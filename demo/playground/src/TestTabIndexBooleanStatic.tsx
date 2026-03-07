import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestTabIndexBooleanStatic = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>TabIndex - Boolean - Static</h3>
            <p tabIndex={true}>true</p>
            <p tabIndex={false}>false</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestTabIndexBooleanStatic_ssr', ret)

    return ret
}

TestTabIndexBooleanStatic.test = {
    static: true,
    expect: () => {
        const expected = '<p tabindex="0">true</p><p>false</p>'

        const ssrComponent = testObservables['TestTabIndexBooleanStatic_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>TabIndex - Boolean - Static</h3><p tabindex="0">true</p><p>false</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestTabIndexBooleanStatic] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestTabIndexBooleanStatic] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestTabIndexBooleanStatic} />