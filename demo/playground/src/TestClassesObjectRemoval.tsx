import { $, $$, renderToString, useEffect, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestClassesObjectRemoval'
const TestClassesObjectRemoval = (): JSX.Element => {
    const o = $<JSX.Class | null>({ red: true, blue: false })
    // Store the observable globally so the test can access it
    registerTestObservable('TestClassesObjectRemoval', o)

    // Add logging for state changes

    const toggle = () => {
        const newState = o(prev => prev ? null : { red: true, blue: false })
        return newState
    }
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Classes - Object Removal</h3>
            <p class={o}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestClassesObjectRemoval()
    const ssrComponent = testObservables[`${name}_ssr`]
    const ssrResult = renderToString(ssrComponent)
    const value = $$(testObservables[name])
    let expectedClass = ''
    if (value && value.red) expectedClass += 'red '
    if (value && value.blue) expectedClass += 'blue '
    const expected = value ?
        `<p class="${expectedClass.trim()}">content</p>` :
        '<p class="">content</p>'
    const expectedFull = value ?
        `<h3>Classes - Object Removal</h3><p class="${expectedClass.trim()}">content</p>` :
        '<h3>Classes - Object Removal</h3><p>content</p>'
    const passed = ssrResult === expectedFull
    console.log(`\n📝 Test: ${name}\n   SSR: ${ssrResult} ${passed ? '✅' : '❌'}\n`)
    if (!passed) { console.error(`❌ [${name}] failed`); process.exit(1) }
}

TestClassesObjectRemoval.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables[name])
        let expected: string
        if (value) {
            let className = ''
            if (value.red) className += 'red '
            if (value.blue) className += 'blue '
            expected = `<p class="${className.trim()}">content</p>`
        } else {
            expected = '<p class="">content</p>'
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestClassesObjectRemoval} />