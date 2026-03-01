import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestClassesArrayStatic = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>Classes - Array Static</h3>
            <p class={['red', false && 'blue', null && 'blue', undefined && 'blue']}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestClassesArrayStatic_ssr', ret)

    return ret
}

TestClassesArrayStatic.test = {
    static: true,
    expect: () => {
        const expected = '<p class="red">content</p>'

        const ssrComponent = testObservables['TestClassesArrayStatic_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>Classes - Array Static</h3>${expected}`
        if (ssrResult !== expectedFull) {
            assert(false, `[TestClassesArrayStatic] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestClassesArrayStatic] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestClassesArrayStatic} />