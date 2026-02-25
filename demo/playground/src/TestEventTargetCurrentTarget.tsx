import { $, $$, renderToString } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert } from './util'

const TestEventTargetCurrentTarget = (): JSX.Element => {
    const ret: JSX.Element = (
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

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestEventTargetCurrentTarget_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                // If it's a JSX element or function, we can render it to string
                // If it's a function, we need to call it first to get the element
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestEventTargetCurrentTarget] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestEventTargetCurrentTarget] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestEventTargetCurrentTarget] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestEventTargetCurrentTarget} />