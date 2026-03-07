import { $, $$, Suspense, useResource, renderToString, type JSX } from 'woby'
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
    const ret: JSX.Element = () => (
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
        const expected = `<p>Fallback: ${String(initialValue)}</p>`

        // Test the SSR value
        const ssrComponent = testObservables['TestSuspenseFallbackObservableStatic_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>Suspense - Fallback Observable Static</h3><p>Fallback: ${String(initialValue)}</p>`
        if (ssrResult !== expectedFull) {
            assert(false, `[TestSuspenseFallbackObservableStatic] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestSuspenseFallbackObservableStatic] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestSuspenseFallbackObservableStatic} />