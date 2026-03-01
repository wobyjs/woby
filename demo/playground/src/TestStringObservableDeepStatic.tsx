import { $, $$, renderToString } from 'woby'
import { useMemo } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const TestStringObservableDeepStatic = (): JSX.Element => {
    const ret: JSX.Element = useMemo(() => {
        const initialValue = "0.123456"
        // For static test, we don't need to register an observable that changes
        const o = $(initialValue)
        // Don't use interval for static test
        const Deep = (): JSX.Element => {
            return (
                <>
                    <h3>String - Observable Deep Static</h3>
                    <p>{initialValue}</p>
                </>
            )
        }
        return <Deep />
    })

    // Store the component for SSR testing
    registerTestObservable('TestStringObservableDeepStatic_ssr', ret)

    return ret
}

TestStringObservableDeepStatic.test = {
    static: true,
    expect: () => {
        const expected = '<p>0.123456</p>'

        const ssrComponent = testObservables['TestStringObservableDeepStatic_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>String - Observable Deep Static</h3><p>0.123456</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestStringObservableDeepStatic] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestStringObservableDeepStatic] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestStringObservableDeepStatic} />