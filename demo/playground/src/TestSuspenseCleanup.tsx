import { $, $$, Suspense, useResource, Ternary, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestSuspenseCleanup'
const TestSuspenseCleanup = (): JSX.Element => {
    const ChildrenPlain = () => {
        return <p>Loaded!</p>
    }
    const ret: JSX.Element = () => (
        <>
            <h3>Suspense - Cleanup</h3>
            <Suspense fallback={<p>Loading...</p>}>
                <ChildrenPlain />
            </Suspense>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestSuspenseCleanup_ssr', ret)

    return ret
}

TestSuspenseCleanup.test = {
    static: true,
    expect: () => {
        const expected = '<p>Loaded!</p>'

        // Test the SSR value
        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Suspense - Cleanup</h3><p>Loaded!</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ ${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestSuspenseCleanup} />