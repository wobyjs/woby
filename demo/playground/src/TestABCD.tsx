import { $, $$, renderToString, useEnvironment, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestABCD'
const TestABCD = (): JSX.Element => {
    const states = [
        () => <i>a</i>,
        () => <u>b</u>,
        () => <b>c</b>,
        () => <span>d</span>
    ]
    const index = $(0)
    // Store the observable globally so the test can access it
    registerTestObservable('TestABCD', index)
    const increment = () => index(prev => (prev + 1) % states.length)
    useInterval(increment, TEST_INTERVAL)

    const getCurrentElement = () => states[index()]

    //why must fn component ?
    //ret is shared with browser & ssr
    //return component directly pin jsx to use browser env
    //same for states
    const ret: JSX.Element = () => (
        <>
            <h3>Children - ABCD</h3>
            <p>{getCurrentElement}</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    TestABCD() // Register the component

    // Test all 4 states
    console.log(`\n📝 Test: ${name}`)
    let allPassed = true
    for (let i = 0; i < 4; i++) {
        ;(testObservables[name] as any)(i)
        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        const fullElements = [
            '<h3>Children - ABCD</h3><p><i>a</i></p>',
            '<h3>Children - ABCD</h3><p><u>b</u></p>',
            '<h3>Children - ABCD</h3><p><b>c</b></p>',
            '<h3>Children - ABCD</h3><p><span>d</span></p>'
        ]
        const expectedFull = fullElements[i]
        const passed = ssrResult === expectedFull
        if (!passed) allPassed = false
        console.log(`   State ${i}: ${ssrResult} ${passed ? '✅' : `❌ (expected: ${expectedFull})`}`)
    }
    console.log(`   Result: ${allPassed ? '✅ ALL PASSED' : '❌ SOME FAILED'}\n`)

    if (!allPassed) {
        console.error(`❌ [${name}] SSR test failed`)
        process.exit(1)
    }
}

TestABCD.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const idx = $$(testObservables[name])
        const elements = ['<p><i>a</i></p>', '<p><u>b</u></p>', '<p><b>c</b></p>', '<p><span>d</span></p>']
        const expected = elements[idx]

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)

        const fullElements = [
            '<h3>Children - ABCD</h3><p><i>a</i></p>',
            '<h3>Children - ABCD</h3><p><u>b</u></p>',
            '<h3>Children - ABCD</h3><p><b>c</b></p>',
            '<h3>Children - ABCD</h3><p><span>d</span></p>'
        ]
        // Actual SSR output format
        const actualElements = [
            '<h3>Children - ABCD</h3><p><i>a</i></p>',
            '<h3>Children - ABCD</h3><p><u>b</u></p>',
            '<h3>Children - ABCD</h3><p><b>c</b></p>',
            '<h3>Children - ABCD</h3><p><span>d</span></p>'
        ]
        const expectedFull = actualElements[idx]
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestABCD} />