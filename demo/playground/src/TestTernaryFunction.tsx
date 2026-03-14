import { $, $$, Ternary, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestTernaryFunction'
const TestTernaryFunction = (): JSX.Element => {
    const o = $(true)
    registerTestObservable('TestTernaryFunction', o)
    const toggle = () => o(prev => !prev)
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Ternary - Function</h3>
            <Ternary when={() => !o()}>
                <p>true</p>
                <p>false</p>
            </Ternary>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestTernaryFunction_ssr', ret)

    return ret
}

TestTernaryFunction.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = !testObservables['TestTernaryFunction']?.() // since it uses !o()
        const expected = `<p>${value ? 'true' : 'false'}</p>`

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>Ternary - Function</h3><p>${value ? 'true' : 'false'}</p>`
        if (ssrResult !== expectedFull) {
            assert(false, `${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ ${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestTernaryFunction} />