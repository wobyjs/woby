import { $, $$, Suspense, useMemo, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const name = 'TestSuspenseChildrenObservableStatic'
const TestSuspenseChildrenObservableStatic = (): JSX.Element => {
    const initialValue = useMemo(() => String(random()))
    registerTestObservable('TestSuspenseChildrenObservableStatic', initialValue)
    const name = 'Children'
    const Children = (): JSX.Element => {
        return <p>Children: {initialValue}</p>
    }
    const name = 'Fallback'
    const Fallback = (): JSX.Element => {
        return <p>Fallback!</p>
    }
    const ret: JSX.Element = () => (
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

        // Test the SSR value
        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>Suspense - Children Observable Static</h3><p>Children: ${initialValue}</p>`
        if (ssrResult !== expectedFull) {
            assert(false, `${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ ${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestSuspenseChildrenObservableStatic} />