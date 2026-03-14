import { $, $$, Suspense, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestSuspenseNever'
const TestSuspenseNever = (): JSX.Element => {
    const Fallback = () => {
        return <p>Loading...</p>
    }
    const Content = () => {
        return <p>Content!</p>
    }
    const ret: JSX.Element = () => (
        <>
            <h3>Suspense - Never</h3>
            <Suspense fallback={<Fallback />}>
                <Content />
            </Suspense>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestSuspenseNever_ssr', ret)

    return ret
}

TestSuspenseNever.test = {
    static: true,
    expect: () => {
        const expected = '<p>Content!</p>'

        // Test the SSR value
        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Suspense - Never</h3><p>Content!</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ ${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestSuspenseNever} />