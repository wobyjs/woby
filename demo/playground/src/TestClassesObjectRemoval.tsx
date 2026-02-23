import { $, $$, renderToString, useEffect } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

let testit = true

const TestClassesObjectRemoval = (): JSX.Element => {
    const o = $<FunctionUnwrap<JSX.Class> | null>({ red: true, blue: false })
    // Store the observable globally so the test can access it
    registerTestObservable('TestClassesObjectRemoval', o)

    // Add logging for state changes
    useEffect(() => {
        console.log('[TestClassesObjectRemoval] Initial state:', $$(o))
    }, [])

    const toggle = () => {
        const newState = o(prev => prev ? null : { red: true, blue: false })
        testit = false
        console.log('[TestClassesObjectRemoval] Toggled to:', newState)
        return newState
    }
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = (
        <>
            <h3>Classes - Object Removal</h3>
            <p class={o}>content</p>
        </>
    )

    // Log the rendered component
    useEffect(() => {
        console.log('[TestClassesObjectRemoval] Component rendered with class observable:', $$(o))
    })

    // Store the component for SSR testing
    registerTestObservable('TestClassesObjectRemoval_ssr', ret)

    return ret
}

TestClassesObjectRemoval.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestClassesObjectRemoval'])
        let expected: string
        if (value) {
            let className = ''
            if (value.red) className += 'red '
            if (value.blue) className += 'blue '
            expected = `<p class="${className.trim()}">content</p>`
        } else {
            expected = '<p>content</p>'
        }

        // Reset testit for next cycle
        testit = !value

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestClassesObjectRemoval_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    // Log the actual SSR result for debugging
                    console.log(`[TestClassesObjectRemoval] SSR result: ${ssrResult}`)

                    // Create expected result based on current store state
                    let expectedClass = ''
                    if (value && value.red) expectedClass += 'red '
                    if (value && value.blue) expectedClass += 'blue '
                    const expectedFull = value ?
                        `<h3>Classes - Object Removal</h3><p class="${expectedClass.trim()}">content</p>` :
                        '<h3>Classes - Object Removal</h3><p>content</p>'

                    if (ssrResult === expectedFull) {
                        console.log(`✅ SSR test passed: ${ssrResult}`)
                    } else {
                        console.error(`❌ SSR test failed:`)
                        console.error(`  Got: ${ssrResult}`)
                        console.error(`  Expected: ${expectedFull}`)
                        assert(false, `SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    }
                }).catch(err => {
                    console.error(`SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestClassesObjectRemoval} />