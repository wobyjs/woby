import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestClassesObjectObservable'
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
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestClassesObjectObservable()
    const ssrComponent = testObservables[`${name}_ssr`]
    const ssrResult = renderToString(ssrComponent)
    const value = $$(testObservables[name])
    const classes = typeof value === 'object' ? Object.keys(value).filter(k => value[k]).join(' ') : (value || '')
    const expected = `<p class="${classes}">content</p>`
    const expectedFull = `<h3>Classes - Object Observable</h3>${expected}`
    const passed = ssrResult === expectedFull
    console.log(`\n📝 Test: ${name}\n   SSR: ${ssrResult} ${passed ? '✅' : '❌'}\n`)
    if (!passed) { console.error(`❌ [${name}] failed`); process.exit(1) }
}

TestClassesObjectObservable.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables[name])
        const classes = typeof value === 'object' ? Object.keys(value).filter(k => value[k]).join(' ') : (value || '')
        return `<p class="${classes}">content</p>`
    }
}


export default () => <TestSnapshots Component={TestClassesObjectObservable} />