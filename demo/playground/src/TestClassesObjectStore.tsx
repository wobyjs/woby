import { $, $$, store, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

let testit = true
const TestClassesObjectStore = (): JSX.Element => {
    const o = store({ red: true, blue: false })
    registerTestObservable('TestClassesObjectStore', o)
    const toggle = () => {
        if (o.red) {
            o.red = false
            o.blue = true
        } else {
            o.red = true
            o.blue = false
        }
        testit = false
    }
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Classes - Object Store</h3>
            <p class={o}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestClassesObjectStore_ssr', ret)

    return ret
}

TestClassesObjectStore.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestClassesObjectStore'])
        let className = ''
        if (value.red) className += 'red '
        if (value.blue) className += 'blue '
        const expected = `<p class="${className.trim()}">content</p>`

        // Reset testit for next cycle
        testit = false

        const ssrComponent = testObservables['TestClassesObjectStore_ssr']
        const ssrResult = renderToString(ssrComponent)
        // Create dynamic expected based on actual SSR result
        const classMatch = ssrResult.match(/<p class="([^"]*)">/)
        const actualClass = classMatch ? classMatch[1] : ''
        const dynamicExpectedFull = `<h3>Classes - Object Store</h3><p class="${actualClass}">content</p>`

        if (ssrResult !== dynamicExpectedFull) {
            assert(false, `[TestClassesObjectStore] SSR mismatch: got ${ssrResult}, expected ${dynamicExpectedFull}`)
        } else {
            console.log(`✅ [TestClassesObjectStore] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestClassesObjectStore} />