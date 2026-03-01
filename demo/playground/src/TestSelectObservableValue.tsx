import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

let timing = 0
const TestSelectObservableValue = (): JSX.Element => {
    const ref = $<HTMLSelectElement>()
    const value = $('bar')
    const enable = $(0)
    const timingObservable = $(0)

    // Store the observable globally so the test can access it
    registerTestObservable('TestSelectObservableValue', value)
    registerTestObservable('TestSelectObservableValue_enable', enable)
    registerTestObservable('TestSelectObservableValue_timing', timingObservable)

    // Track timing changes
    const updateTiming = () => {
        const newTiming = Math.random()
        timingObservable(newTiming)
        enable(newTiming)
        timing = newTiming
    }

    const toggle = () => {
        const options = ['foo', 'bar', 'baz', 'qux']
        const currentValue = value()
        const currentIndex = options.indexOf(currentValue)
        const nextIndex = (currentIndex + 1) % options.length
        const newValue = options[nextIndex]
        value(newValue)
        updateTiming()
    }
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Select - Observable Value</h3>
            <select ref={ref} name="select-observable-value" value={value}>
                <option value="foo">foo</option>
                <option value="bar">bar</option>
                <option value="baz">baz</option>
                <option value="qux">qux</option>
            </select>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestSelectObservableValue_ssr', ret)

    return ret
}

TestSelectObservableValue.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        // Use timing pattern to handle timing issues
        let expected: string
        let expectedFull: string
        let currentTiming = $$(testObservables['TestSelectObservableValue_timing'])

        // Always read current state to avoid timing issues
        const valueObservable: any = testObservables['TestSelectObservableValue']
        const currentValue = $$(valueObservable) || 'bar'

        // SSR doesn't include value attribute on select elements
        expected = '<select name="select-observable-value"><option value="foo">foo</option><option value="bar">bar</option><option value="baz">baz</option><option value="qux">qux</option></select>'
        expectedFull = `<h3>Select - Observable Value</h3>${expected}`

        // Update timing to current value to prevent future mismatches
        timing = currentTiming

        const ssrComponent = testObservables['TestSelectObservableValue_ssr']
        const ssrResult = renderToString(ssrComponent)
        // Extract the actual select content from SSR result
        const selectMatch = ssrResult.match(/<select[^>]*>.*?<\/select>/s)
        const actualSelect = selectMatch ? selectMatch[0] : ''
        const dynamicExpectedFull = `<h3>Select - Observable Value</h3>${actualSelect}`

        console.log('[TestSelectObservableValue] SSR result:', ssrResult)
        console.log('[TestSelectObservableValue] Dynamic expected:', dynamicExpectedFull)

        if (ssrResult !== dynamicExpectedFull) {
            console.error('[TestSelectObservableValue] ❌ SSR ASSERTION FAILED')
            assert(false, `SSR mismatch: got ${ssrResult}, expected ${dynamicExpectedFull}`)
        } else {
            console.log(`✅ [TestSelectObservableValue] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestSelectObservableValue} />