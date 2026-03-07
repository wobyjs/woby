import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, random, registerTestObservable, testObservables, assert } from './util'

const TestStringObservableStatic = (): JSX.Element => {
    const initialValue = "0.123456"
    const ret: JSX.Element = () => (
        <>
            <h3>String - Observable Static</h3>
            <p>{initialValue}</p>
        </>
    )

    // Store the component for SSR testing - only in environments where function is available
    if (typeof registerTestObservable !== 'undefined') {
        registerTestObservable('TestStringObservableStatic_ssr', ret)
    }

    return ret
}

TestStringObservableStatic.test = {
    static: true,
    expect: () => {
        const expected = '<p>0.123456</p>'

        const ssrComponent = testObservables['TestStringObservableStatic_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>String - Observable Static</h3><p>0.123456</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestStringObservableStatic] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestStringObservableStatic] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestStringObservableStatic} />