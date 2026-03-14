import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestStringStatic'
const TestStringStatic = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>String - Static</h3>
            <p>{'string'}</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestStringStatic_ssr', ret)

    return ret
}

TestStringStatic.test = {
    static: true,
    expect: () => {
        const expected = '<p>string</p>'

        // Test the SSR value
        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>String - Static</h3><p>string</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ ${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestStringStatic} />