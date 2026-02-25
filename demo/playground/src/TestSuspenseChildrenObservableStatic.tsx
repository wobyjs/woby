import { $, $$, Suspense, useMemo, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const TestSuspenseChildrenObservableStatic = (): JSX.Element => {
    const initialValue = useMemo(() => String(random()))
    registerTestObservable('TestSuspenseChildrenObservableStatic', initialValue)
    const Children = (): JSX.Element => {
        return <p>Children: {initialValue}</p>
    }
    const Fallback = (): JSX.Element => {
        return <p>Fallback!</p>
    }
    const ret: JSX.Element = (
        <>
            <h3>Suspense - Children Observable Static</h3>
            <Suspense fallback={<Fallback />}>
                <Children />
            </Suspense>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestSuspenseChildrenObservableStatic_ssr', ret)

    return ret
}

TestSuspenseChildrenObservableStatic.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const initialValue = $$(testObservables['TestSuspenseChildrenObservableStatic'])
        const expected = `<p>Children: ${initialValue}</p>`

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestSuspenseChildrenObservableStatic_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = `<h3>Suspense - Children Observable Static</h3><p>Children: ${initialValue}</p>`
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestSuspenseChildrenObservableStatic] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestSuspenseChildrenObservableStatic] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestSuspenseChildrenObservableStatic] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestSuspenseChildrenObservableStatic} />