import { $, $$, renderToString, type JSX } from 'woby'
import { useMemo, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const name = 'TestStringObservableDeepStatic'
const TestStringObservableDeepStatic = (): JSX.Element => {
    const ret: JSX.Element = useMemo(() => {
        const initialValue = "0.123456"
        // For static test, we don't need to register an observable that changes
        const o = $(initialValue)
        // Don't use interval for static test
        const name = 'Deep'
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
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestStringObservableDeepStatic()
    const ssrComponent = testObservables[`TestStringObservableDeepStatic_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestStringObservableDeepStatic\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestStringObservableDeepStatic.test = {
    static: true,
    expect: () => {
        const expected = '<p>0.123456</p>'

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>String - Observable Deep Static</h3><p>0.123456</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestStringObservableDeepStatic} />