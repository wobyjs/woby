import { $, $$, renderToString } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert } from './util'

const TestEventTargetCurrentTarget = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>Event - Target - Current Target</h3>
            <div onClick={e => console.log({ element: 'div', target: e.target, currentTarget: e.currentTarget })}>
                <p>paragraph</p>
                <ul onClick={e => console.log({ element: 'ul', target: e.target, currentTarget: e.currentTarget })}>
                    <li>one</li>
                    <li onClick={e => console.log({ element: 'li', target: e.target, currentTarget: e.currentTarget })}>two</li>
                    <li>three</li>
                </ul>
            </div>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestEventTargetCurrentTarget_ssr', ret)

    return ret
}

TestEventTargetCurrentTarget.test = {
    static: true,
    expect: () => {
        // Define expected values for both main test and SSR test
        const expectedFull = '<h3>Event - Target - Current Target</h3><div><p>paragraph</p><ul><li>one</li><li>two</li><li>three</li></ul></div>'  // For SSR comparison
        const expected = '<div><p>paragraph</p><ul><li>one</li><li>two</li><li>three</li></ul></div>'   // For main test comparison

        const ssrComponent = testObservables['TestEventTargetCurrentTarget_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestEventTargetCurrentTarget] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestEventTargetCurrentTarget] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestEventTargetCurrentTarget} />