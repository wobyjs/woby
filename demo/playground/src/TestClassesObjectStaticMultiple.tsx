import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestClassesObjectStaticMultiple = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>Classes - Object Static Multiple</h3>
            <p class={{ 'red bold': true }}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestClassesObjectStaticMultiple_ssr', ret)

    return ret
}

TestClassesObjectStaticMultiple.test = {
    static: true,
    expect: () => {
        const expected = '<p class="red bold">content</p>'

        const ssrComponent = testObservables['TestClassesObjectStaticMultiple_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>Classes - Object Static Multiple</h3>${expected}`
        if (ssrResult !== expectedFull) {
            assert(false, `[TestClassesObjectStaticMultiple] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestClassesObjectStaticMultiple] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestClassesObjectStaticMultiple} />