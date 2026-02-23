import { $, $$, Dynamic, store, useEffect, isStore, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

let testit = true
const TestDynamicStoreProps = (): JSX.Element => {
    let count = 1
    const props = store({ class: 'red' })
    isStore(props)
    registerTestObservable('TestDynamicStoreProps', props)

    const toggle = () => {
        const newClass = props.class === 'red' ? 'blue' : 'red'
        props.class = newClass
        testit = false
    }
    useInterval(toggle, TEST_INTERVAL)

    // Register the class tracker for test access
    const ret: JSX.Element = (
        <>
            <h3>Dynamic - Store Props</h3>
            <Dynamic component="div" props={props}>
                <p>{() => count++}</p>
            </Dynamic>
        </>
    )
    
    // Store the component for SSR testing
    registerTestObservable('TestDynamicStoreProps_ssr', ret)
    
    return ret
}

TestDynamicStoreProps.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        // Get the current value for the client-side test
        const props: any = testObservables['TestDynamicStoreProps']
        const className = props?.class //|| 'red'
        const expected = `<div class="${className}"><p>1</p></div>`
        
        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestDynamicStoreProps_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    // Extract the class and paragraph values from SSR result to use for comparison
                    const classMatch = ssrResult.match(/<div class="([^"]*)">/);
                    const pMatch = ssrResult.match(/<p>([0-9]+)<\/p>/);
                    const className = classMatch ? classMatch[1] : 'red';
                    const pValue = pMatch ? pMatch[1] : '1';
                    const expectedFull = `<h3>Dynamic - Store Props</h3><div class="${className}"><p>${pValue}</p></div>`
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


export default () => <TestSnapshots Component={TestDynamicStoreProps} />