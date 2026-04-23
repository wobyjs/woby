import { $, $$, Ternary, useTimeout, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const name = 'TestTernaryChildrenFunction'
const TestTernaryChildrenFunction = (): JSX.Element => {
    const trueValue = $(String(random()))
    const falseValue = $(String(random()))
    registerTestObservable(`${name}_true`, trueValue)
    registerTestObservable(`${name}_false`, falseValue)
    let true1 = false

    const True = () => {
        const o = $(String(random()))
        const randomize = () => o(String(random()))
        // useInterval(randomize, TEST_INTERVAL)
        if (!true1) {
            useTimeout(randomize, TEST_INTERVAL)
            true1 = true
        }
        o()
        return <p>True: {trueValue}</p>
    }

    let false1 = false
    const False = () => {
        const o = $(String(random()))
        const randomize = () => o(String(random()))
        // useInterval(randomize, TEST_INTERVAL)
        if (!false1) {
            useTimeout(randomize, TEST_INTERVAL)
            false1 = true
        }
        o()
        return <p>False: {falseValue}</p>
    }
    const ret: JSX.Element = () => (
        <>
            <h3>Ternary - Children Function</h3>
            <Ternary when={true}>
                {True}
                {False}
            </Ternary>
            <Ternary when={false}>
                {True}
                {False}
            </Ternary>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestTernaryChildrenFunction()
    const ssrComponent = testObservables[`TestTernaryChildrenFunction_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestTernaryChildrenFunction\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestTernaryChildrenFunction.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const trueValue = testObservables[`${name}_true`]?.() ?? '0.123456'
        const falseValue = testObservables[`${name}_false`]?.() ?? '0.789012'
        const expected = `<p>True: ${trueValue}</p><p>False: ${falseValue}</p>`

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>Ternary - Children Function</h3><p>True: ${trueValue}</p><p>False: ${falseValue}</p>`
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestTernaryChildrenFunction} />