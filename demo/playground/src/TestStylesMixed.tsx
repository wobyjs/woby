import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestStylesMixed = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>Styles - Mixed</h3>
            <div style={[{ color: 'red' }, [{ fontStyle: () => 'italic' }]]}>example</div>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestStylesMixed_ssr', ret)

    return ret
}

TestStylesMixed.test = {
    static: true,
    expect: () => {
        const expected = '<div style="color: red; font-style: italic;">example</div>'

        // Test the SSR value
        const ssrComponent = testObservables['TestStylesMixed_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Styles - Mixed</h3><div style="color: red; font-style: italic;">example</div>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestStylesMixed] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestStylesMixed] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestStylesMixed} />