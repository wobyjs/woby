import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const name = 'TestComponentObservableDirect'
const TestComponentObservableDirect = (): JSX.Element => {
    const getRandom = (): number => random()
    const o = $(getRandom())
    registerTestObservable('TestComponentObservableDirect', o)
    const randomize = () => o(getRandom())
    useInterval(randomize, TEST_INTERVAL)

    const ret: JSX.Element = () => (
        <>
            <h3>Component - Observable Direct</h3>
            <p>{o}</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestComponentObservableDirect.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables[name])

        // Define expected values for both main test and SSR test
        const expectedFull = `<h3>Component - Observable Direct</h3><p>${value}</p>`  // For SSR comparison
        const expected = `<p>${value}</p>`   // For main test comparison

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ ${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}



export default () => <TestSnapshots Component={TestComponentObservableDirect} />