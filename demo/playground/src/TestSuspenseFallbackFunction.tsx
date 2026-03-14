import { $, $$, Suspense, useResource, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const name = 'TestSuspenseFallbackFunction'
const TestSuspenseFallbackFunction = (): JSX.Element => {
    const initialValue = String(random())
    registerTestObservable('TestSuspenseFallbackFunction', initialValue)
    const name = 'Children'
    const Children = (): JSX.Element => {
        const resource = useResource(() => {
            return new Promise<undefined>(() => { })
        })
        return <p>children {resource.value}</p>
    }
    const name = 'Fallback'
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
        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>Suspense - Fallback Function</h3><p>Fallback: ${String(initialValue)}</p>`
        if (ssrResult !== expectedFull) {
            assert(false, `${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ ${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestSuspenseFallbackFunction} />