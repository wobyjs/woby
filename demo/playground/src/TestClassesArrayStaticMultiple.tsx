import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestClassesArrayStaticMultiple = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>Classes - Array Static Multiple</h3>
            <p class={['red bold']}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestClassesArrayStaticMultiple_ssr', ret)

    return ret
}

TestClassesArrayStaticMultiple.test = {
    static: true,
    expect: () => {
        const expected = '<p class="red bold">content</p>'

        const ssrComponent = testObservables['TestClassesArrayStaticMultiple_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>Classes - Array Static Multiple</h3>${expected}`
        if (ssrResult !== expectedFull) {
            assert(false, `[TestClassesArrayStaticMultiple] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestClassesArrayStaticMultiple] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestClassesArrayStaticMultiple} />