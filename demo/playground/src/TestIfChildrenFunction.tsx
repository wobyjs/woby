import { $, $$, If, renderToString, type JSX } from 'woby'
import { TestSnapshots, random, registerTestObservable, testObservables, useInterval, TEST_INTERVAL, assert } from './util'
import { useEffect, type JSX } from 'woby'

const name = 'TestIfChildrenFunction'
const TestIfChildrenFunction = (): JSX.Element => {
    const initialValue = String(random())
    const valueObs = $(initialValue)
    registerTestObservable('TestIfChildrenFunction', valueObs)
    const Content = () => {
        return <p>{valueObs()}</p>
    }


    const ret: JSX.Element = () => (
        <>
            <h3>If - Children Function</h3>
            <If when={true}><Content /></If>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestIfChildrenFunction()
    const ssrComponent = testObservables[`TestIfChildrenFunction_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestIfChildrenFunction\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestIfChildrenFunction.test = {
    static: true,
    expect: () => {
        // For static test, return the actual value from the observable
        const value = $$(testObservables[name]) ?? 'default'

        // Define expected values for both main test and SSR test
        const expectedFull = `<h3>If - Children Function</h3><p>${value}</p>`
        const expected = `<p>${value}</p>`

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestIfChildrenFunction} />