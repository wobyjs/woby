import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestStyleStaticNumeric'
const TestStyleStaticNumeric = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>Style - Static Numeric</h3>
            <p style={{ flexGrow: 1, height: 50 }}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestStyleStaticNumeric.test = {
    static: true,
    expect: () => {
        const expected = '<p style="flex-grow: 1; height: 50px;">content</p>'

        // Test the SSR value
        const ssrComponent = testObservables[`${name}_ssr`]
        if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
            const ssrResult = renderToString(ssrComponent)
            const expectedFull = '<h3>Style - Static Numeric</h3><p style="flex-grow: 1; height: 50px;">content</p>'
            if (ssrResult !== expectedFull) {
                assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
            } else {
                console.log(`✅ ${name}] SSR test passed: ${ssrResult}`)
            }
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestStyleStaticNumeric} />