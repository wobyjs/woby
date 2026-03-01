import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestStyleObservableVariable = (): JSX.Element => {
    const o = $('green')
    registerTestObservable('TestStyleObservableVariable', o)
    const toggle = () => o(prev => (prev === 'orange') ? 'green' : 'orange')
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Style - Observable Variable</h3>
            <p style={{ color: 'var(--color)', '--color': o }}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestStyleObservableVariable_ssr', ret)

    return ret
}

TestStyleObservableVariable.test = {
    static: false,
    expect: () => {
        const value = $$(testObservables['TestStyleObservableVariable'])
        const expected = `<p style="color: var(--color); --color: ${value};">content</p>`

        // Test the SSR value
        const ssrComponent = testObservables['TestStyleObservableVariable_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>Style - Observable Variable</h3><p style="color: var(--color); --color: ${value};">content</p>`
        if (ssrResult !== expectedFull) {
            assert(false, `[TestStyleObservableVariable] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestStyleObservableVariable] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestStyleObservableVariable} />