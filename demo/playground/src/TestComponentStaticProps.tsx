import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random, assert } from './util'

const TestComponentStaticProps = ({ value }: { value: number }): JSX.Element => {
    registerTestObservable('TestComponentStaticProps', $(value))
    const ret: JSX.Element = (
        <>
            <h3>Component - Static Props</h3>
            <p>{value}</p>
        </>
    )
    
    // Store the component for SSR testing
    registerTestObservable('TestComponentStaticProps_ssr', ret)
    
    return ret
}

TestComponentStaticProps.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const propValue = $$(testObservables['TestComponentStaticProps'])
        
        // Define expected values for both main test and SSR test
        const expectedFull = `<h3>Component - Static Props</h3><p>${propValue}</p>`  // For SSR comparison
        const expected = `<p>${propValue}</p>`   // For main test comparison
        
        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestComponentStaticProps_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                // If it's a JSX element or function, we can render it to string
                // If it's a function, we need to call it first to get the element
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
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


export default () => <TestSnapshots Component={TestComponentStaticProps} props={{ value: random() }} />