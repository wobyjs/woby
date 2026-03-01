import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestClassesObjectObservable = (): JSX.Element => {
    const o = $({ red: true, blue: false })
    registerTestObservable('TestClassesObjectObservable', o)
    const toggle = () => o(prev => prev.red ? { red: false, blue: true } : { red: true, blue: false })
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Classes - Object Observable</h3>
            <p class={o}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestClassesObjectObservable_ssr', ret)

    return ret
}

TestClassesObjectObservable.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestClassesObjectObservable'])
        const classes = typeof value === 'object' ? Object.keys(value).filter(k => value[k]).join(' ') : (value || '')
        const expected = `<p class="${classes}">content</p>`

        const ssrComponent = testObservables['TestClassesObjectObservable_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>Classes - Object Observable</h3>${expected}`
        if (ssrResult !== expectedFull) {
            assert(false, `[TestClassesObjectObservable] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestClassesObjectObservable] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestClassesObjectObservable} />