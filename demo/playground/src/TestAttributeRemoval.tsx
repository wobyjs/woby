import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert } from './util'

const name = 'TestAttributeRemoval'
const TestAttributeRemoval = (): JSX.Element => {
    const o = $<string | null>(null)  // Start with null to test removal
    registerTestObservable('TestAttributeRemoval', o)
    const ret: JSX.Element = () => (
        <>
            <h3>Attribute - Removal</h3>
            <p data-color={o}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestAttributeRemoval()
    const ssrComponent = testObservables[`${name}_ssr`]
    const ssrResult = renderToString(ssrComponent)
    const value = $$(testObservables[name])
    const expected = value ? `<p data-color="${value}">content</p>` : '<p>content</p>'
    const expectedFull = `<h3>Attribute - Removal</h3>${expected}`
    const passed = ssrResult === expectedFull
    console.log(`\n📝 Test: ${name}\n   SSR: ${ssrResult} ${passed ? '✅' : '❌'}\n`)
    if (!passed) { console.error(`❌ [${name}] failed`); process.exit(1) }
}

TestAttributeRemoval.test = {
    static: true, // Make it static for predictable testing
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables[name])
        const expected = value ? `<p data-color="${value}">content</p>` : '<p>content</p>'

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>Attribute - Removal</h3>${expected}`
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestAttributeRemoval} />