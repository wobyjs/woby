import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestABCD = (): JSX.Element => {
    const states = [
        <i>a</i>,
        <u>b</u>,
        <b>c</b>,
        <span>d</span>
    ]
    const index = $(0)
    // Store the observable globally so the test can access it
    registerTestObservable('TestABCD', index)
    const increment = () => index(prev => (prev + 1) % states.length)
    useInterval(increment, TEST_INTERVAL)
    
    const getCurrentElement = () => states[index()]
    
    const ret: JSX.Element = (
        <>
            <h3>Children - ABCD</h3>
            <p>{getCurrentElement}</p>
        </>
    )
    
    // Store the component for SSR testing
    registerTestObservable('TestABCD_ssr', ret)
    
    return ret
}

TestABCD.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const idx = $$(testObservables['TestABCD'])
        const elements = ['<p><i>a</i></p>', '<p><u>b</u></p>', '<p><b>c</b></p>', '<p><span>d</span></p>']
        const expected = elements[idx]
        
        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestABCD_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const fullElements = [
                        '<h3>Children - ABCD</h3><p><i>a</i></p>',
                        '<h3>Children - ABCD</h3><p><u>b</u></p>',
                        '<h3>Children - ABCD</h3><p><b>c</b></p>',
                        '<h3>Children - ABCD</h3><p><span>d</span></p>'
                    ]
                    const expectedFull = fullElements[idx]
                    if (ssrResult !== expectedFull) {
                        assert(false, `SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
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


export default () => <TestSnapshots Component={TestABCD} />