import { $, $$, Suspense, useResource, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const TestSuspenseFallbackObservableStatic = (): JSX.Element => {
    const initialValue = String(random())
    registerTestObservable('TestSuspenseFallbackObservableStatic', initialValue)
    const Children = (): JSX.Element => {
        const resource = useResource(() => {
            return new Promise<undefined>(() => { })
        })
        return <p>children {resource.value}</p>
    }
    const Fallback = (): JSX.Element => {
        return <p>Fallback: {initialValue}</p>
    }
    const ret: JSX.Element = (
        <>
            <h3>Suspense - Fallback Observable Static</h3>
            <Suspense fallback={<Fallback />}>
                <Children />
            </Suspense>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestSuspenseFallbackObservableStatic_ssr', ret)

    return ret
}

TestSuspenseFallbackObservableStatic.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const initialValue = testObservables['TestSuspenseFallbackObservableStatic']
        const expected = `<p>Fallback: ${initialValue}</p>`

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestSuspenseFallbackObservableStatic_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = `<h3>Suspense - Fallback Observable Static</h3><p>Fallback: ${initialValue}</p>`
                    if (ssrResult !== expectedFull) {
                        assert(false, `SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestSuspenseFallbackObservableStatic} />