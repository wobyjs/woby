import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestChildrenBoolean = (): JSX.Element => {
    const Custom = ({ children }) => {
        return <p>{Number(children)}</p>
    }
    const ret: JSX.Element = () => (
        <>
            <h3>Children - Boolean</h3>
            <Custom>{true}</Custom>
            <Custom>{false}</Custom>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestChildrenBoolean_ssr', ret)

    return ret
}

TestChildrenBoolean.test = {
    static: true,
    expect: () => {
        const expected = '<p>1</p><p>0</p>'

        const ssrComponent = testObservables['TestChildrenBoolean_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Children - Boolean</h3><p>1</p><p>0</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestChildrenBoolean] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestChildrenBoolean] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestChildrenBoolean} />