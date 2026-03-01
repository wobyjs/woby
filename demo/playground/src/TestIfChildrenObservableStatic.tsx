import { $, $$, If, renderToString } from 'woby'
import { TestSnapshots, random, registerTestObservable, testObservables, useInterval, TEST_INTERVAL, assert } from './util'
import { useEffect } from 'woby'

const TestIfChildrenObservableStatic = (): JSX.Element => {
    const initialValue = String(random())
    const valueObs = $(initialValue)
    registerTestObservable('TestIfChildrenObservableStatic', valueObs)
    const Content = () => {
        return <p>{valueObs()}</p>
    }


    const ret: JSX.Element = () => (
        <>
            <h3>If - Children Observable Static</h3>
            <If when={true}><Content /></If>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestIfChildrenObservableStatic_ssr', ret)

    return ret
}

TestIfChildrenObservableStatic.test = {
    static: true,
    expect: () => {
        // For static test, return the actual value from the observable
        const value = $$(testObservables['TestIfChildrenObservableStatic']) ?? 'default'

        // Define expected values for both main test and SSR test
        const expectedFull = `<h3>If - Children Observable Static</h3><p>${value}</p>`
        const expected = `<p>${value}</p>`

        const ssrComponent = testObservables['TestIfChildrenObservableStatic_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestIfChildrenObservableStatic] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestIfChildrenObservableStatic] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestIfChildrenObservableStatic} />