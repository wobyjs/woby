import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestChildrenSymbol'
const TestChildrenSymbol = (): JSX.Element => {
    const Custom = ({ children }) => {
        return <p>{typeof children}</p>
    }
    const ret: JSX.Element = () => (
        <>
            <h3>Children - Boolean</h3>
            <Custom>{Symbol()}</Custom>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestChildrenSymbol_ssr', ret)

    return ret
}

TestChildrenSymbol.test = {
    static: true,
    expect: () => {
        const expected = '<p>symbol</p>'

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Children - Boolean</h3><p>symbol</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ ${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestChildrenSymbol} />