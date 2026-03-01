import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestClassesObjectFunction = (): JSX.Element => {
    const o = $({ red: true, blue: false })
    registerTestObservable('TestClassesObjectFunction', o)
    const toggle = () => o(prev => prev.red ? { red: false, blue: true } : { red: true, blue: false })
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Classes - Object Function</h3>
            <p class={() => o()}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestClassesObjectFunction_ssr', ret)

    return ret
}

TestClassesObjectFunction.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestClassesObjectFunction'])
        const classes = typeof value === 'object' ? Object.keys(value).filter(k => value[k]).join(' ') : (value || '')
        const expected = `<p class="${classes}">content</p>`

        const ssrComponent = testObservables['TestClassesObjectFunction_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>Classes - Object Function</h3>${expected}`
        if (ssrResult !== expectedFull) {
            assert(false, `[TestClassesObjectFunction] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestClassesObjectFunction] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestClassesObjectFunction} />