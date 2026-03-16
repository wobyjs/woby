import { $, $$, Ternary, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const name = 'TestTernaryChildrenObservableStatic'
const TestTernaryChildrenObservableStatic = (): JSX.Element => {
    const trueValue = $(String(random()))
    const falseValue = $(String(random()))
    registerTestObservable(`${name}_true`, trueValue)
    registerTestObservable(`${name}_false`, falseValue)
    const True = () => {
        const o = $(String(random()))
        const randomize = () => o(String(random()))
        useInterval(randomize, TEST_INTERVAL)
        o()
        return <p>True: {trueValue}</p>
    }
    const False = () => {
        const o = $(String(random()))
        const randomize = () => o(String(random()))
        useInterval(randomize, TEST_INTERVAL)
        o()
        return <p>False: {falseValue}</p>
    }
    const ret: JSX.Element = () => (
        <>
            <h3>Ternary - Children Observable Static</h3>
            <Ternary when={true}>
                <True />
                <False />
            </Ternary>
            <Ternary when={false}>
                <True />
                <False />
            </Ternary>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestTernaryChildrenObservableStatic.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const trueValue = $$(testObservables[`${name}_true`])
        const falseValue = $$(testObservables[`${name}_false`])
        const expected = `<p>True: ${trueValue}</p><p>False: ${falseValue}</p>`

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>Ternary - Children Observable Static</h3><p>True: ${trueValue}</p><p>False: ${falseValue}</p>`
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestTernaryChildrenObservableStatic} />