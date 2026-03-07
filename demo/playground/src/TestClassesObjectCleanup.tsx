import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestClassesObjectCleanup = (): JSX.Element => {
    const o = $<JSX.ClassProperties>({ red: true })
    registerTestObservable('TestClassesObjectCleanup', o)
    const toggle = () => o(prev => prev.red ? { blue: true } : { red: true })
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Classes - Object Cleanup</h3>
            <p class={o}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestClassesObjectCleanup_ssr', ret)

    return ret
}

TestClassesObjectCleanup.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestClassesObjectCleanup'])
        const classes = typeof value === 'object' ? Object.keys(value).filter(k => value[k]).join(' ') : (value || '')
        const expected = `<p class="${classes}">content</p>`

        const ssrComponent = testObservables['TestClassesObjectCleanup_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>Classes - Object Cleanup</h3>${expected}`
        if (ssrResult !== expectedFull) {
            assert(false, `[TestClassesObjectCleanup] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestClassesObjectCleanup] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestClassesObjectCleanup} />