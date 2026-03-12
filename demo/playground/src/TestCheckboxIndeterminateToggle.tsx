import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestCheckboxIndeterminateToggle = (): JSX.Element => {
    const o = $<boolean>(false)
    const toggle = () => o(prev => !prev)
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Checkbox - Indeterminate Toggle</h3>
            <input type="checkbox" indeterminate={o} />
            <input type="checkbox" checked indeterminate={o} />
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestCheckboxIndeterminateToggle_ssr', ret)

    return ret
}

TestCheckboxIndeterminateToggle.test = {
    static: true,
    expect: () => {
        const ssrExpected = '<input type="checkbox" /><input type="checkbox" checked="" />'
        const domExpected = '<input type="checkbox"><input type="checkbox">'

        //<input type="checkbox"></input><input type="checkbox"></input>' to match one of the expected values 
        //<input type=\"checkbox\"><input type=\"checkbox\">

        const ssrComponent = testObservables['TestCheckboxIndeterminateToggle_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>Checkbox - Indeterminate Toggle</h3>${ssrExpected}`
        if (ssrResult !== expectedFull) {
            assert(false, `[TestCheckboxIndeterminateToggle] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestCheckboxIndeterminateToggle] SSR test passed: ${ssrResult}`)
        }

        return domExpected
    }
}


export default () => <TestSnapshots Component={TestCheckboxIndeterminateToggle} />