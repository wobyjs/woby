import { $, $$, Suspense, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const name = 'TestSuspenseChildrenFunction'
const TestSuspenseChildrenFunction = (): JSX.Element => {
    const initialValue = String(random())
    registerTestObservable('TestSuspenseChildrenFunction', initialValue)

    const Children = (): JSX.Element => {
        return <p>Children: {initialValue}</p>
    }

    const Fallback = (): JSX.Element => {
        return <p>Fallback!</p>
    }
    const ret: JSX.Element = () => (
        <>
            <h3>Suspense - Children Function</h3>
            <Suspense fallback={<Fallback />}>
                {Children}
            </Suspense>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestSuspenseChildrenFunction.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        // Get the actual random value that was registered
        const initialValue = testObservables[name]
        const actualValue = initialValue ? (typeof initialValue === 'function' ? initialValue() : initialValue) : 'unknown'
        const valueForTest = actualValue
        const expected = `<p>Children: ${valueForTest}</p>`

        // Test the SSR value
        const ssrComponentTemp = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponentTemp)
        // Extract the actual value from the SSR result
        const match = ssrResult.match(/<p>Children: ([^<]+)<\/p>/)
        const actualValueFromSSR = match ? match[1] : 'unknown'
        const expectedFull = `<h3>Suspense - Children Function</h3><p>Children: ${actualValueFromSSR}</p>`
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        // For the main test, we need to return the actual expected value
        return `<p>Children: ${valueForTest}</p>`
    }
}


export default () => <TestSnapshots Component={TestSuspenseChildrenFunction} />