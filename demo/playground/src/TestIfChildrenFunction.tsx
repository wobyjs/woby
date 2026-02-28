import { $, $$, If, renderToString } from 'woby'
import { TestSnapshots, random, registerTestObservable, testObservables, useInterval, TEST_INTERVAL, assert } from './util'
import { useEffect } from 'woby'

const TestIfChildrenFunction = (): JSX.Element => {
    const initialValue = String(random())
    const valueObs = $(initialValue)
    registerTestObservable('TestIfChildrenFunction', valueObs)
    const Content = () => {
        return <p>{valueObs()}</p>
    }


    const ret: JSX.Element = (
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

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestIfChildrenFunction_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestIfChildrenFunction] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestIfChildrenFunction] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestIfChildrenFunction] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestIfChildrenFunction} />