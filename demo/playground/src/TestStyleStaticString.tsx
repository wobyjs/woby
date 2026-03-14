import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestStyleStaticString'
const TestStyleStaticString = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>Style - Static String</h3>
            <p style="flex-grow: 1; height: 50px;">content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestStyleStaticString_ssr', ret)

    return ret
}

TestStyleStaticString.test = {
    static: true,
    expect: () => {
        const expected = '<p style="flex-grow: 1; height: 50px;">content</p>'

        // Test the SSR value
        const ssrComponent = testObservables[`${name}_ssr`]
        if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
            const ssrResult = renderToString(ssrComponent)
            const expectedFull = '<h3>Style - Static String</h3><p style="flex-grow: 1; height: 50px;">content</p>'
            if (ssrResult !== expectedFull) {
                assert(false, `${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
            } else {
                console.log(`✅ ${name}] SSR test passed: ${ssrResult}`)
            }
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestStyleStaticString} />