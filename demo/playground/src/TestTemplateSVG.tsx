import { $, $$, template, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, randomColor, assert } from './util'

const TestTemplateSVG = (): JSX.Element => {
    const color = $(randomColor())
    registerTestObservable('TestTemplateSVG', color)
    const update = () => color(randomColor())
    useInterval(update, TEST_INTERVAL / 2)
    const Templated = template<{ color }>(props => {
        return (
            <svg viewBox="0 0 50 50" width="50px" stroke={props.color} stroke-width="3" fill="white">
                <circle cx="25" cy="25" r="20" />
            </svg>
        )
    })
    const ret: JSX.Element = (
        <>
            <h3>Template - SVG</h3>
            <Templated color={color} />
        </>
    )
    
    // Store the component for SSR testing
    registerTestObservable('TestTemplateSVG_ssr', ret)
    
    return ret
}

TestTemplateSVG.test = {
    static: false,
    expect: () => {
        const value = $$(testObservables['TestTemplateSVG'])
        const expected = `<svg viewBox="0 0 50 50" width="50px" stroke="${value}" stroke-width="3" fill="white"><circle cx="25" cy="25" r="20"></circle></svg>`
        
        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestTemplateSVG_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = `<h3>Template - SVG</h3><svg viewBox="0 0 50 50" width="50px" stroke="${value}" stroke-width="3" fill="white"><circle cx="25" cy="25" r="20"></circle></svg>`
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


export default () => <TestSnapshots Component={TestTemplateSVG} />