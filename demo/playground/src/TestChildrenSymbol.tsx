import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

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

        const ssrComponent = testObservables['TestChildrenSymbol_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Children - Boolean</h3><p>symbol</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestChildrenSymbol] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestChildrenSymbol] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestChildrenSymbol} />