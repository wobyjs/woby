import { $, $$, Suspense, useResource, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const TestSuspenseFallbackFunction = (): JSX.Element => {
    const initialValue = String(random())
    registerTestObservable('TestSuspenseFallbackFunction', initialValue)
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
            <h3>Suspense - Fallback Function</h3>
            <Suspense fallback={Fallback}>
                <Children />
            </Suspense>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestSuspenseFallbackFunction_ssr', ret)

    return ret
}

TestSuspenseFallbackFunction.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const initialValue = testObservables['TestSuspenseFallbackFunction']
        const expected = `<p>Fallback: ${String(initialValue)}</p>`

        // Test the SSR value
        const ssrComponent = testObservables['TestSuspenseFallbackFunction_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>Suspense - Fallback Function</h3><p>Fallback: ${String(initialValue)}</p>`
        if (ssrResult !== expectedFull) {
            assert(false, `[TestSuspenseFallbackFunction] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestSuspenseFallbackFunction] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestSuspenseFallbackFunction} />