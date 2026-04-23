import { $, $$, Dynamic, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestDynamicHeading'
const TestDynamicHeading = (): JSX.Element => {
    const level = $(1 as 1 | 2 | 3 | 4 | 5 | 6)
    registerTestObservable('TestDynamicHeading', level)
    const increment = () => {
        const nextLevel = (level() + 1) % 7 || 1
        level(nextLevel as 1 | 2 | 3 | 4 | 5 | 6)
    }
    useInterval(increment, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Dynamic - Heading</h3>
            {() => {
                const headings = { 1: 'h1', 2: 'h2', 3: 'h3', 4: 'h4', 5: 'h5', 6: 'h6' }
                const tag = headings[level()]
                return <Dynamic component={tag}>
                    Level: {level}
                </Dynamic>
            }}
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestDynamicHeading()
    const ssrComponent = testObservables[`TestDynamicHeading_ssr`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(`\n📝 Test: TestDynamicHeading\n   SSR: ${ssrResult} ✅\n`)
    }
}

TestDynamicHeading.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const level = $$(testObservables[name])

        // Define expected values for both main test and SSR test
        const expectedFull = `<h3>Dynamic - Heading</h3><h${level}>Level: ${level}</h${level}>`  // For SSR comparison
        const expected = `<h${level}>Level: ${level}</h${level}>`   // For main test comparison

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestDynamicHeading} />