import { $, $$, store, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

let testit = true  // Track assertion cycles for timing coordination
const TestClassesObjectStoreMultiple = (): JSX.Element => {
    const o = store({ 'red bold': true, blue: false })
    registerTestObservable('TestClassesObjectStoreMultiple', o)
    const toggle = () => {
        console.log('[TestClassesObjectStoreMultiple] Toggling classes')
        if (o['red bold']) {
            o['red bold'] = false
            o.blue = true
            console.log('[TestClassesObjectStoreMultiple] Set to blue')
        } else {
            o['red bold'] = true
            o.blue = false
            console.log('[TestClassesObjectStoreMultiple] Set to red bold')
        }
        testit = false  // Signal that state has changed
    }
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Classes - Object Store Multiple</h3>
            <p class={o}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestClassesObjectStoreMultiple_ssr', ret)

    return ret
}

TestClassesObjectStoreMultiple.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestClassesObjectStoreMultiple'])
        let className = ''
        if (value['red bold']) className += 'red bold '
        if (value.blue) className += 'blue '
        const expected = `<p class="${className.trim()}">content</p>`

        // Manage testit state for proper timing
        if (testit) {
            // First assertion - use initial state
            testit = false
        } else {
            // Subsequent assertions - reset for next cycle
            testit = true
        }

        const ssrComponent = testObservables['TestClassesObjectStoreMultiple_ssr']
        const ssrResult = renderToString(ssrComponent)
        // Extract the actual class from SSR result for comparison
        const classMatch = ssrResult.match(/<p class="([^"]*)">/)
        const actualClass = classMatch ? classMatch[1] : ''

        // Create expected result based on current store state
        let expectedClass = ''
        if (value['red bold']) expectedClass += 'red bold '
        if (value.blue) expectedClass += 'blue '
        const expectedFull = `<h3>Classes - Object Store Multiple</h3><p class="${expectedClass.trim()}">content</p>`

        if (ssrResult === expectedFull) {
            console.log(`✅ [TestClassesObjectStoreMultiple] SSR test passed: ${ssrResult}`)
        } else {
            console.error(`❌ SSR test failed:`)
            console.error(`  Got: ${ssrResult}`)
            console.error(`  Expected: ${expectedFull}`)
            assert(false, `[TestClassesObjectStoreMultiple] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestClassesObjectStoreMultiple} />