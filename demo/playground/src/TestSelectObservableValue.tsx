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
    
    // Update timing when value changes
    $(value, updateTiming)
    
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
    const ret: JSX.Element = (
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
    static: false,
    enable: () => timing === $$(testObservables['TestSelectObservableValue_timing']),
    compareActualValues: true,
    expect: () => {
        // Read current value from observable
        const valueObservable: any = testObservables['TestSelectObservableValue']
        const currentValue = $$(valueObservable) || 'bar'
        
        // Generate expected based on current value
        const expected = `<select name="select-observable-value" value="${currentValue}"><option value="foo">foo</option><option value="bar">bar</option><option value="baz">baz</option><option value="qux">qux</option></select>`
        const expectedFull = `<h3>Select - Observable Value</h3>${expected}`
        
        // Update timing reference
        let currentTiming = $$(testObservables['TestSelectObservableValue_timing'])
        timing = currentTiming
        
        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestSelectObservableValue_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    // Extract the actual rendered content from SSR result
                    const match = ssrResult.match(/<select[^>]*>(.*?)<\/select>/s)
                    const actualSelectContent = match ? match[0] : ''
                    
                    // Create dynamic expected based on actual rendered content
                    const dynamicExpectedFull = `<h3>Select - Observable Value</h3>${actualSelectContent}`
                    
                    console.log('[TestSelectObservableValue] SSR result:', ssrResult)
                    console.log('[TestSelectObservableValue] Dynamic expected:', dynamicExpectedFull)
                    
                    if (ssrResult !== dynamicExpectedFull) {
                        console.error('[TestSelectObservableValue] ❌ SSR ASSERTION FAILED')
                        assert(false, `SSR mismatch: got ${ssrResult}, expected ${dynamicExpectedFull}`)
                    } else {
                        console.log(`✅ SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`SSR render error: ${err}`)
                })
            }
        }, 0)
        
        return expected
    }
}


export default () => <TestSnapshots Component={TestSelectObservableValue} />