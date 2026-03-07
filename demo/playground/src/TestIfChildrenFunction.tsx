import { $, $$, If, renderToString, type JSX } from 'woby'
import { TestSnapshots, random, registerTestObservable, testObservables, useInterval, TEST_INTERVAL, assert } from './util'
import { useEffect, type JSX } from 'woby'

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
    registerTestObservable('TestIfChildrenFunction_ssr', ret)

    return ret
}

TestIfChildrenFunction.test = {
    static: true,
    expect: () => {
        // For static test, return the actual value from the observable
        const value = $$(testObservables['TestIfChildrenFunction']) ?? 'default'

        // Define expected values for both main test and SSR test
        const expectedFull = `<h3>If - Children Function</h3><p>${value}</p>`
        const expected = `<p>${value}</p>`

        const ssrComponent = testObservables['TestIfChildrenFunction_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestIfChildrenFunction] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestIfChildrenFunction] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestIfChildrenFunction} />