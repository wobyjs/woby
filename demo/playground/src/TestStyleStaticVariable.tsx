import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestStyleStaticVariable = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>Style - Static Variable</h3>
            <p style={{ color: 'var(--color)', '--color': 'green', '--foo': undefined, '--bar': null }}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestStyleStaticVariable_ssr', ret)

    return ret
}

TestStyleStaticVariable.test = {
    static: true,
    expect: () => {
        const expected = '<p style="color: var(--color); --color: green;">content</p>'

        // Test the SSR value
        const ssrComponent = testObservables['TestStyleStaticVariable_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Style - Static Variable</h3><p style="color: var(--color); --color: green;">content</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestStyleStaticVariable] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestStyleStaticVariable] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestStyleStaticVariable} />

// console.log(renderToString(<TestStyleStaticVariable />))