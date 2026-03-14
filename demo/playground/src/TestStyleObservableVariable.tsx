import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestStyleObservableVariable'
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
        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>Style - Observable Variable</h3><p style="color: var(--color); --color: ${value};">content</p>`
        if (ssrResult !== expectedFull) {
            assert(false, `${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ ${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestStyleObservableVariable} />