import { $, $$, Suspense, useResource, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestSuspenseObservable'
const TestSuspenseObservable = (): JSX.Element => {
    const Content = () => {
        return <p>Content! 123</p>  // Static content
    }
    const ret: JSX.Element = () => (
        <>
            <h3>Suspense - Observable</h3>
            <Suspense fallback={<p>Loading...</p>}>
                <Content />
            </Suspense>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestSuspenseObservable.test = {
    static: true,
    expect: () => {
        const expected = '<p>Content! 123</p>'

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Suspense - Observable</h3><p>Content! 123</p>'
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestSuspenseObservable} />