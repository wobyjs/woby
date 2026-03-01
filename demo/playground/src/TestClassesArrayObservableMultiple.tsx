import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestClassesArrayObservableMultiple = (): JSX.Element => {
    const o = $(['red bold', false])
    registerTestObservable('TestClassesArrayObservableMultiple', o)
    const toggle = () => o(prev => prev[0] ? [false, 'blue'] : ['red bold', false])
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Classes - Array Observable Multiple</h3>
            <p class={o}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestClassesArrayObservableMultiple_ssr', ret)

    return ret
}

TestClassesArrayObservableMultiple.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestClassesArrayObservableMultiple'])
        const classes = Array.isArray(value) ? value.filter(v => v && v !== false).join(' ') : (value || '')
        const expected = `<p class="${classes}">content</p>`

        const ssrComponent = testObservables['TestClassesArrayObservableMultiple_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>Classes - Array Observable Multiple</h3>${expected}`
        if (ssrResult !== expectedFull) {
            assert(false, `[TestClassesArrayObservableMultiple] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        } else {
            console.log(`✅ [TestClassesArrayObservableMultiple] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestClassesArrayObservableMultiple} />