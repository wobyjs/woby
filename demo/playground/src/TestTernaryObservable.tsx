import { $, $$, Ternary, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestTernaryObservable'
const TestTernaryObservable = (): JSX.Element => {
    const o = $(true)
    registerTestObservable('TestTernaryObservable', o)
    const toggle = () => o(prev => !prev)
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Ternary - Observable</h3>
            <Ternary when={o}>
                <p>true</p>
                <p>false</p>
            </Ternary>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestTernaryObservable.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = testObservables[name]?.() ?? true
        const expected = `<p>${value ? 'true' : 'false'}</p>`

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>Ternary - Observable</h3><p>${value ? 'true' : 'false'}</p>`
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ ${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestTernaryObservable} />